import {h, Component} from 'preact'
import cloneDeep from 'lodash/cloneDeep'
import M from 'materialize-css'
import Axios from 'axios'

import {Loader} from '../Partial'
import {fhirBase} from '../util'

import '../styles/permissions.scss'

// permissions base, similar to FHIR base, but with a different content-type
export const permissionsBase = Axios.create({
	baseURL: '/',
	headers: {
		accept: 'application/json',
		'content-type': 'application/json',
	},
})

// apply a new token for every request as logging in natively will use old token
permissionsBase.interceptors.request.use((config) => {
	if (localStorage.getItem('token')) {
		config.headers.token = localStorage.getItem('token')
	}
	return config
})


class Permissions extends Component {
	constructor() {
		super()
		this.state = {
			practitioners: [], // practitioner list from API (Bundle resourceType)
			patients: [], // patient list by encounter from API
			selectedPractitioner: null,
			practitionerPermissions: [],
			loaded: false,
		}
		this.permissions = [
			{ident: 'view:allpatients', desc: 'View all patients without any need for assignment'},
			{ident: 'edit:permissions', desc: 'Edit permissions of any practitioner'},
			{ident: 'delete:patients', desc: 'Delete any patient'},
			{ident: 'add:patients', desc: 'Admit a patient'},
			{ident: 'add:wards', desc: 'Create a new ward'},
			{ident: 'add:vitals', desc: 'Add vital signs readings'},
			{ident: 'add:user', desc: 'Add a new user (for non-google login'},
			{ident: 'edit:link', desc: 'Change the link between practitioners and patients'},
		]
		this.renderPermissions = this.renderPermissions.bind(this)
		this.togglePermission = this.togglePermission.bind(this)
		// bind setPractitioner so the returned arrow func has `this` bound to instance of Permissions
		// ensures that if a child component is used, the correct state is updated
		this.setPractitioner = this.setPractitioner.bind(this)
	}

	/**
	 * get practitioner and encounter information from server. update state for lists
	 */
	async componentDidMount() {
		const [{data: practitioners}, {data: patients}] = await Promise.all([
			fhirBase.get('/Practitioner'),
			fhirBase.get('/Encounter/?class=admission&_include=Encounter:patient;location'),
		])
		this.setState({
			practitioners,
			patients,
			selectedPractitioner: null,
			// deep clone because the method will be acting on the objects underneath
			oldPatients: cloneDeep(patients),
			loaded: true,
		})
	}

	/**
	 * create a function that:
		* pull all data (patient relationships and permissions) from server
		* stores this data in state
	 * @param {number} id practitioner ID (database PK)
	 */
	setPractitioner(id) {
		return async () => {
			// fetch union table from permissions API
			// sadly FHIR has poor support for permissions
			const [{data}, {data: {permissions}}] = await Promise.all([
				permissionsBase.get(`/permissions/relationships/${id}`),
				permissionsBase.get(`/permissions/view/${id}`),
			])
			const patientIDs = data.map(datum => datum.patient_id)
			const patients = cloneDeep(this.state.oldPatients)
			// elems in matches are objects and thus handlded by ref
			// they can be given a 'grouped' attr
			const matches = patients.filter(patient => patientIDs.includes(patient.subject.id))
			matches.map(match => match.grouped = true)
			this.setState({selectedPractitioner: id, patients, practitionerPermissions: permissions})
		}
	}

	/**
	 * take the selected practitioner (set in state)
	 * and a function that creates/removes a row with practitioner id and patient ID
	 * in practitionerpatients table
	 * @param {number} patientID patient ID to group
	 * @param {boolean} grouped whether the practitioner and patient are grouped
	 */
	makeGrouping(patientID, grouped = false) {
		/**
		 * Attempt to POST to /permissions/destroy or /permission/create
		 * depending on whether patient is already grouped
		 * grouped data stored in state, from /permissions/relationships/:id
		 */
		return async () => {
			if (!this.state.selectedPractitioner) return
			const baseUrl = grouped ? 'destroy' : 'create'
			try {
				await permissionsBase.post(`/permissions/${baseUrl}`, {
					patientID,
					practitionerID: this.state.selectedPractitioner,
				})
				const oldID = this.state.selectedPractitioner
				await this.componentDidMount()
				await this.setPractitioner(oldID)()
				M.toast({html: 'Successfully updated patient and practitioner'})
			} catch (err) {
				M.toast({html: 'You do not have access to do this!'})
			}
		}
	}

	/**
	 * attempt to add or remove a practitioner permission
	 * post this to /permissions/toggle as well as practitioner id, permission and their permission set
	 * @param {string} perm permission to add/remove
	 */
	togglePermission(perm) {
		return async () => {
			try {
				console.log({
					practitionerID: this.state.selectedPractitioner,
					permission: perm,
					set: this.state.practitionerPermissions,
				})
				const resp = await permissionsBase.post('/permissions/toggle', {
					practitionerID: this.state.selectedPractitioner,
					permission: perm,
					set: this.state.practitionerPermissions,
				})
				console.log(resp)
				this.setState({practitionerPermissions: resp.data.permissions}, () => {
					M.toast({html: `Successfully changed ${perm}`})
				})
			} catch (err) {
				M.toast({html: 'You do not have permission to do this!'})
			}
		}
	}


	/**
	 * render a list of practitioners
	 * @returns {preact.VNode[]}
	 */
	renderPractitioners() {
		return this.state.practitioners.entry.map(practitioner => (
			<li
				onClick={this.setPractitioner(practitioner.id)}
				key={practitioner.telecom[0].value}
				className={`collection-item hover practitioner ${this.state.selectedPractitioner === practitioner.id ? 'selected' : ''}`}
			>
				<span className="title"><b>Name:</b> {practitioner.name[0].given[0]}</span>
				<p><b>Username:</b> {practitioner.telecom[0].value}</p>
			</li>
		))
	}

	/**
	 * render patient list
	 * @returns {preact.VNode[]}
	 */
	renderPatients() {
		return this.state.patients.map(patient => (
			<li
				key={patient.subject.id}
				className={`collection-item hover patient ${patient.grouped ? 'selected' : ''}`}
				onClick={this.makeGrouping(patient.subject.id, patient.grouped)}
			>
				<span className="title"><b>Name:</b> {patient.subject.name[0].text}</span>
				<p><b>Ward:</b> {patient.location[0].name}</p>
			</li>
		))
	}

	/**
	 * render a permission list based off of component state
	 * @returns {preact.VNode[]}
	 */
	renderPermissions() {
		const perms = this.state.practitionerPermissions
		return this.permissions.map(perm => (
			<li
				key={perm.ident}
				className={`collection-item hover ${perms.includes(perm.ident) ? 'selected' : ''}`}
				onClick={this.togglePermission(perm.ident)}
			>
				<span className="title"><b>Permission: </b>{perm.ident}</span>
				<p><b>Description: </b>{perm.desc}</p>
			</li>
		))
	}

	/**
	 * render patient permissions page.
	 * render loader is no patient information loaded yet
	 * @returns {preact.VNode}
	 */
	render() {
		if (!this.state.loaded) return <Loader />
		return (
			<div className="row permissions-table">
				<div className="col s6">
					<h2>Users</h2>
					<ul className="collection">{this.renderPractitioners()}</ul>
				</div>
				<div className="col s6">
					<div className="row">
						<h2>Patients</h2>
						<ul className="collection">{this.renderPatients()}</ul>
					</div>
					<div className="row">
						<h2>Edit permissions</h2>
						<ul className="collection">{this.renderPermissions()}</ul>
					</div>
				</div>
			</div>
		)
	}
}

export default Permissions
