import React, { useState } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { sendResponse } from '../../actions/courseActions'
import M from 'materialize-css/dist/js/materialize.min.js';

const GoogleForm = ({ quiz, user, current, sendResponse }) => {
    const [file, setFile] = useState();
    console.log(quiz)

    const onFileChange = (e) => {
        setFile(e.target.files[0]);
    }
    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        console.log(formData)

        sendResponse(formData, current._id, quiz._id)
        M.toast({ html: 'Response submitted!' })
        // const config = {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'x-auth-token': localStorage.token
        //     }
        // }
        // const response = await axios.post(`https://codeitbackend.herokuapp.com/api/mycourse/marks_entry/${current._id}/${quiz._id}`, formData, config)
        // console.log(response)

    }

    return (
        <div className="container">
            <div className="center">
                <h3 className="teal-text">{quiz.Title}</h3>
                <h6>{quiz.Description}</h6>
            </div>
            <br />
            <iframe src={quiz.Link} width="100%" height="945" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>
            <br /><br />
            {
                user.role === 'admin' && (<div className="container" style={{ marginBottom: "150px" }}>
                    <h3 className="teal-text">Submit the responses here</h3>
                    <div className="form-group">
                        <input type="file" onChange={onFileChange} />
                    </div>
                    <br />
                    <input type="submit" value="Sumit" onClick={onSubmit}
                        className="btn btn-large btn-extended waves-effect waves-grey teal white-text" />
                </div>)
            }
        </div>
    )
}


const mapStateToProps = (state) => ({
    quiz: state.course.quiz,
    user: state.user.user,
    current: state.course.currentCourse
})

export default connect(mapStateToProps, { sendResponse })(GoogleForm)
