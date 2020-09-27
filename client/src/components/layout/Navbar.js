import React, { Fragment } from 'react';
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { logout, loadUser } from '../../actions/userActions'
import M from 'materialize-css/dist/js/materialize.min.js';
import '../../App.css';

const Navbar = ({ user: { user, isAuthenticated }, logout, icon, title }) => {


    const onLogout = () => {
        logout()
        M.toast({ html: 'Successfully logged out' })
    }

    const loadUserDetail = () => {
        loadUser()
    }

    return (
        <div>
            <div class="navbar-fixed">
                <nav class="teal">
                    <div class="nav-h">
                        <div class="nav-wrapper">
                            <a href="/" data-target="slide-out" className="sidenav-trigger"><i className="material-icons">menu</i></a>
                            <a href="/" class="brand-logo"><div><span className="white-text lighten-5">Course - </span><span>It</span></div></a>
                            <ul class="right hide-on-med-and-down">
                                <li>
                                    <Link to='/' class="waves-effect waves-light">Home</Link>
                                </li>
                                {isAuthenticated ? (

                                    < Fragment >
                                        {user && user.role !== 'admin' ? (
                                            <Fragment>

                                                <li>
                                                    My Courses
                                                    <Link to="/myCourses" className="waves-effect waves-light"><i className="material-icons large">golf_course</i></Link>
                                                </li>
                                            </Fragment>

                                        ) : (
                                                <li>
                                                     <Link to="/addCourse" className="waves-effect waves-light">Add a new course</Link>
                                                   
                                                </li>)}
                                        <li>
                                            <span>
                                                &nbsp;&nbsp;&nbsp;Hello, {user.name}
                                            </span>
                                        </li> &nbsp;&nbsp;

                                        <li>
                                            <Link to='/login' onClick={onLogout} href='#!' className="waves-effect waves-light">
                                                <i className="fas fa-sign-out-alt"></i>
                                                <span className="hide-sm">Logout</span>
                                            </Link>
                                        </li>&nbsp;&nbsp;&nbsp;&nbsp;
                                        <li>
                                            <img src={user.imageUrl} alt="" height="50" width="50" style={{ marginTop: 5 }} className="circle"></img>
                                        </li>
                                    </Fragment>
                                ) : (
                                        <Fragment>
                                            <li>
                                                <Link to='/register' class="waves-effect waves-light">Register</Link>
                                            </li>
                                            <li>
                                                <Link to='/login' class="waves-effect waves-light">Login</Link>
                                            </li>
                                        </Fragment>)}
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        </div >
    )
}

Navbar.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.string,
    user: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired
}

Navbar.defaultProps = {
    title: 'Galatz',
    icon: 'fas fa-pizza-slice'
}


const mapStateToProps = (state) => ({
    user: state.user
})

export default connect(mapStateToProps, { logout })(Navbar)
