import React from 'react'
import { Link } from "react-router-dom";
import { setCurrent } from '../../actions/courseActions'
import { connect } from 'react-redux'
import '../../App.css';

const CourseItem = ({ course, setCurrent }) => {
    const { Name, description, Thumbnail } = course

    const setCurrentCourse = () => {
        setCurrent(course);
    }

    return (
        <div className="column" float="left" width="50%">
            <div className="col s6 m4 l6">
                <div class="card">
                    <div class="card-image waves-effect waves-block waves-light">
                        <img class="activator" src={Thumbnail} />

                    </div>
                    {/* <a class="btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons">add</i></a> */}
                    <div class="card-content">
                        <span class="card-title grey-text text-darken-4"><h2 className="teal-text courseTitle">{Name}</h2>
                        <Link
                                to="/courseDetail"
                                class="btn-floating waves-effect waves-light teal  darken-1"
                                onClick={setCurrentCourse}
                            >
                                <i class="material-icons">chevron_right</i>
                            </Link></span>
                    </div>
                    <div class="card-reveal">
                        
                        <span class="card-title grey-text text-darken-4"><h4>{Name}< i class="material-icons right">close</i></h4></span>
                        <p class="view-desc">{description}</p>

                    </div>
                </div>
            </div>
        </div >
    )
}

export default connect(null, { setCurrent })(CourseItem)