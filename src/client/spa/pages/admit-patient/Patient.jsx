import {h} from 'preact'
import isMobile from 'ismobilejs'

import {Input, Select} from '../../Partial'

const DesktopWebcamDisplay = props => (
	<div className="card">
		<div className="card-image">
			<video ref={v => props.setVideo(v)} id="video" onClick={props.playVideo} />
			<canvas ref={c => props.setCanvas(c)} style={{display: 'none'}} width="300" height="300" />
		</div>
		<div className="card-action">
			<a onClick={props.getImg} className="teal-text text-lighten-1">
				<i className="material-icons left">camera_alt</i>Take Picture
			</a>
		</div>
	</div>
)

const MobileImageUpload = props => (
	<div className="file-field input-field">
		<div className="btn">
			<span>Take Photo</span>
			<input onChange={props.setImg} type="file" accept="image/*" capture="camera" value="Take Photo" />
		</div>
		<div className="file-path-wrapper">
			<input className="file-path validate" type="text" />
		</div>
	</div>
)

const PatientDemographicInfo = props => (
	<div>
		<h3>Patient Details</h3>
		<div className="card-panel z-depth-2">
			<div className="row">
				<div className="col m6 s12">
					<Input id="patient-prefix" label="Title" className="s12" />
					<Input id="patient-given" label="First Name" className="s12" />
					<Input id="patient-family" label="Surname" className="s12" />
					<Select
						id="patient-gender"
						default="---Select a Gender---"
						label="Gender"
						className="m12 s12"
						options={[{val: 'male', text: 'Male'}, {val: 'female', text: 'Female'}, {val: 'other', text: 'Other'}]}
					/>
					<Select
						id="location_id"
						default="---Select a Ward---"
						options={props.wards}
						label="Patient Ward"
						className="m12 s12"
					/>
				</div>
				<div className="col m6 s12">
					{isMobile.any
						? <MobileImageUpload setImg={props.setImg} />
						: <DesktopWebcamDisplay {...props} />
					}
				</div>
			</div>
		</div>
	</div>
)

export default PatientDemographicInfo
