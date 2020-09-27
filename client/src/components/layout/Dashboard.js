import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { getCourses, clearFilter, filterCourses } from '../../actions/courseActions'
import { loadUser } from '../../actions/userActions'
import CourseItem from './CourseItem'

const Dashboard = ({ courses, getCourses, clearFilter, filterCourses, filtered, loadUser }) => {
    const text = useRef("");
    useEffect(() => {
        getCourses();
        loadUser();
    }, [])

    const onChange = (e) => {
        if (text.current.value !== "") {
            filterCourses(e.target.value);
        } else {
            clearFilter();
        }
    };

    const onClickClose = () => {
        text.current.value = "";
        clearFilter();
    };

    return (
        <div>
            <div className="center">
                <h2>
                    <span class="grey-text">All</span>
                    <span className="teal-text"> Courses</span>
                </h2>
                <br/>
                <div className="container s12 m10">
                    <nav
                        className="teal darken-2 container"
                        style={{
                            marginBottom: "30px",
                        }}
                    >
                        <div class="nav-wrapper">
                            <form>
                                <div class="input-field">
                                    <input
                                        id="search"
                                        type="search"
                                        placeholder="Search Courses.."
                                        ref={text}
                                        onChange={onChange}
                                        required
                                    />
                                    <label class="label-icon" for="search">
                                        <i class="material-icons">
                                            search
                  </i>
                                    </label>
                                    <i class="material-icons" onClick={onClickClose}>close</i>
                                </div>
                            </form>
                        </div>
                    </nav>
                </div>
                {filtered === null ? (<div className="container s10 m5">
                    <div className="row">
                        {courses && courses.map((course) =>
                            <CourseItem course={course} key={course.id} />
                        )}
                    </div>
                </div>) : (<div className="container s10 m5">
                    <div className="row">
                        {filtered.map((course) =>
                            <CourseItem course={course} key={course.id} />
                        )}
                    </div>
                </div>)}

            </div>
        </div>
    )
}
const mapStateToProps = (state) => ({
    courses: state.course.courses,
    filtered: state.course.filtered
})

export default connect(mapStateToProps, { getCourses, clearFilter, filterCourses, loadUser })(Dashboard)
