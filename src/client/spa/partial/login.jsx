import {h, Component} from 'preact'
import M from 'materialize-css'
import axios from 'axios'

class Login extends Component {
	constructor() {
		super()
		this.state = {loginUrl: '/'}
	}

	async componentDidMount() {
		const loginUrl = await fetch('/login/url').then(r => r.text())
		this.setState({loginUrl}, () => {
			// this.modalInst = M.Modal.init(this.modal)
			this.tabInst = M.Tabs.init(this.tabs)
			this.tabInst.select('test1') // because class=active doesn't work 🤷‍♂️
		})
	}

	async handleLogin() {
		// get the user/pass
		const payload = {
			username: this.loginUN.value,
			password: this.loginPW.value,
		}

		try {
			// send it to the API
			const resp = await axios.post('/login', payload)
			M.toast({html: resp.data.message})
			// response should be JWT - save this to storage
			localStorage.setItem('token', resp.data.token)
			// close the login window
			const modal = document.querySelector('.modal.login-modal')
			const inst = M.Modal.getInstance(modal) || M.Modal.init(modal)
			inst.close()
			window.location.href = window.location.href
		} catch (err) {
			M.toast({html: err.response.data})
		}
	}

	async handleRegister() {
		// get the goods
		const payload = {
			name: this.regFN.value,
			username: this.regUN.value,
			password: this.regPW.value,
		}

		try {
			// send it to the API
			const resp = await axios.post('/login/create', payload)
			M.toast({html: resp.data})
			// focus on login page
			this.tabInst.select('test1')
		} catch (err) {
			M.toast({html: err.response.data})
		}
	}


	render() {
		return (
			<div className="col s12">
				<div id="modal1" className="modal login-modal" ref={m => this.modal = m}>
					<div className="modal-content">
						<div className="row">
							<div className="col s12">
								<ul className="tabs tabs-fixed-width" ref={t => this.tabs = t}>
									<li className="tab col s3"><a className="active" href="#test1">Log In</a></li>
									<li className="tab col s3"><a href="#test2">Register</a></li>
								</ul>
							</div>
							<div id="test1" className="col s12">
								<h6 className="center">Login with MyPort access patient information</h6>
								<div className="row">
									<div className="col s12 center">
										<a href={this.state.loginUrl} className="waves-effect waves-light btn">Login via Google</a>
									</div>
								</div>
								<div className="divider" />
								<div className="row">
									<form className="col s12">
										<div className="row">
											<div className="input-field col m6 push-m3 s12">
												<input ref={un => this.loginUN = un} id="login-username" type="text" className="validate" />
												<label htmlFor="login-username">Username</label>
											</div>
										</div>
										<div className="row">
											<div className="input-field col m6 push-m3 s12">
												<input ref={pw => this.loginPW = pw} id="login-password" type="password" className="validate" />
												<label htmlFor="login-password">Password</label>
											</div>
										</div>
										<div className="row">
											<a className="waves-effect waves-light btn" onClick={this.handleLogin.bind(this)}>Login</a>
										</div>
									</form>
								</div>
							</div>
							<div id="test2" className="col s12">
								<div className="row">
									<form className="col s12">
										<div className="row">
											<div className="input-field col s6">
												<input ref={fn => this.regFN = fn} id="register-name" type="text" className="validate" />
												<label htmlFor="register-name">Full Name</label>
											</div>
											<div className="input-field col s6">
												<input ref={un => this.regUN = un} id="register-username" type="text" className="validate" />
												<label htmlFor="register-username">Username</label>
											</div>
											<div className="input-field col s6">
												<input ref={pw => this.regPW = pw} id="register-password" type="password" className="validate" />
												<label htmlFor="register-password">Password</label>
											</div>
										</div>
										<div className="col s6">
											<a className="waves-effect waves-light btn" onClick={this.handleRegister.bind(this)}>Register</a>
										</div>
									</form>
								</div>
							</div>

						</div>
					</div>
					<div className="modal-footer">
						<a className="modal-close waves-effect waves-green btn-flat">Close</a>
					</div>
				</div>
			</div>
		)
	}
}

export default Login
