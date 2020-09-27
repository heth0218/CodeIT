import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import VideoPlayer from './VideoPlayer'
import { Link } from "react-router-dom";
import { setQuiz, getAnalytics, showAll } from '../../actions/courseActions'
import { loadUser } from '../../actions/userActions'
import axios from 'axios'
import M from 'materialize-css/dist/js/materialize.min.js';
import '../../App.css';

const CourseDetails = ({ myCourses, current, user, setQuiz, getAnalytics, showAll, loadUser }) => {
    const { Name, description, videos, quiz, Thumbnail } = current
    const [mine, setMine] = useState(false);

    useEffect(() => {
        if (myCourses) {
            myCourses.map(course => {
                if (course._id === current._id) {
                    setMine(true)
                }
            })
        }
        loadUser();

    }, [mine])
    const setQuizz = (qu) => {
        setQuiz(qu)
    }
    const getAnalyticss = () => {
        getAnalytics(current._id, user._id)
    }
    const getAllUsers = () => {
        showAll(current._id)
    }
    const enroll = async (e) => {
        e.preventDefault();
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const data = []

        const response = await axios.post(`https://codeitbackend.herokuapp.com/api/mycourse/enroll/${current._id}`)
        console.log(response.data)
        M.toast({ html: `${current.Name} has been added to your course list` })
    }
    return (
        <div className="container" style={{ marginBottom: '100px' }}>
            <div className="center">
                <h2>
                    <span class="grey-text">Course</span>
                    <span className="teal-text"> Details</span>
                </h2>
            </div>
            <br />
            <br />
            <h3>{Name}</h3>
            <div className="row">
                <div className="col">
                    <div className="card red lighten-5">
                        <div className="card-image">
                            <img src={Thumbnail} />
      
                            <h2><span className="card-title c-name">{Name}</span></h2>

                            <span></span>
                        </div>
                    </div>
                </div>
            </div>
            {!mine && user.role !== 'admin' && < div > <Link to="/" onClick={enroll} class="waves-effect waves-light btn-large">Enroll in this course</Link></div>}
            {
                mine && <div >
                    <h4 className="teal-text">Book special doubt solving sessions with experts</h4>
                    <br />
                    <Link to="/personalMeet" className="btn waves-effect waves-light"><i className="material-icons left">event</i>Book Personal Meet</Link>
                    <br /><br />
                    <Link to="/getAnalytics" onClick={getAnalyticss} className="btn waves-effect waves-light"><i className="material-icons left">analytics</i>Analyse your performance</Link>

                </div>
            }
            <div className="center"><h4 className="c-name center">Range of tutorials for this course</h4></div>
            <br/>
            <div className="container panel">
                <div className="row">
                    <div className="col s12 m12 l8">
                        <div className="collection">
                            {videos && videos.map((video) =>
                                <VideoPlayer video={video} key={video.id} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <br/>
            <center><div className="hr"></div></center>
            <div className="center"><h4 className="c-name center">Fun quizes waiting for you!</h4></div>
            <br/>
            <div className="container panel">
                <div className="row">
                    <div className="col s12 m12 l8">
                        <div className="collection">
                            {((mine && quiz) || (user.role === 'admin' && quiz)) && quiz.map((qu) =>
                                <div>
                                    <Link href="#!" to='/google' class="collection-item" onClick={setQuizz.bind(this, qu)} ><span class="badge"></span><h4>{qu.Title}</h4><br /><p>{qu.Description}</p></Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            {
                user.role === 'admin' && <div className="right">
                    <Link to='/video' class="btn-floating btn-large waves-effect waves-light teal"><i class="material-icons">add</i></Link>&nbsp;&nbsp;&nbsp;&nbsp;
                <Link to='/newQuiz' class="btn btn-large waves-effect waves-light teal">Add New Quiz</Link>
                </div>
            }
            {
                user.role === 'admin' && (
                    <Link to='/showAll' onClick={getAllUsers} class="btn btn-large waves-effect waves-light teal">Get Analytics</Link>

                )
            }
        </div >
    )
}

const mapStateToProps = (state) => ({
    current: state.course.currentCourse,
    user: state.user.user,
    myCourses: state.course.myCourses,

})


export default connect(mapStateToProps, { setQuiz, getAnalytics, showAll, loadUser })(CourseDetails)
