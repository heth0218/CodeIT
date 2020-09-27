import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import M from "materialize-css/dist/js/materialize.min.js"
import { loadUser } from "../../actions/userActions"
import { addCourse } from '../../actions/courseActions'
import firebase from './firebase'

const AddCourse = ({ addCourse, loadUser, user }) => {
    useEffect(() => {
        if (localStorage.token) {
            loadUser()
        }
        // eslint-disable-next-line
    }, [])


    const [files, setFiles] = useState();
    const [url, setUrl] = useState();
    const [course, setCourse] = useState({
        name: "",
        description: "",
        price: ''
    })
    const {
        name,
        description,
        price
    } = course


    const handleChange = (file) => {
        setFiles(file)
    }

    const onChange = (e) =>
        setCourse({ ...course, [e.target.name]: e.target.value })

    const onSubmit = async (e) => {
        e.preventDefault()
        if (!files) {
            return M.toast({ html: "Please insert a thumbnail!" });
        }
        let bucketName = 'images';
        let file = files[0];
        console.log('file', file)
        let storageRef = firebase.storage().ref(`${bucketName}/${file.name}`);
        let uploadTask = storageRef.put(file);
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, () => {
            let downloadURL = uploadTask.snapshot.downloadURL
        })
        storageRef = firebase.storage().ref();

        // storageRef.child('images/' + files[0].name).getDownloadURL().then((url) => {
        //     console.log(url);
        //     setUrl(url)
        // })
        const url = await storageRef.child('images/' + files[0].name).getDownloadURL();
        setUrl(url)
        console.log(url)
        M.toast({ html: "Course saved successfully" });

        if (!url) {
            return M.toast({ html: 'Please upload a Thumbnail' })
        }

        console.log(
            name,
            description,
            url
        )

        addCourse(
            name,
            description,
            url,
            price
        )
        M.toast({ html: ` ${name}, you have successfully been registered ` })
    }

    return (
        <div className="container">
            {!user ? (
                <h2>Please Login to avail this facility</h2>
            ) : (
                    <div className="form-container">
                        <center><h2>
                            <span class="grey-text">Add</span>
                            <span className="teal-text"> Course</span>
                            <br /><br />
                        </h2></center>
                        <form onSubmit={onSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={name}
                                    onChange={onChange}
                                ></input>
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <input
                                    type="text"
                                    name="description"
                                    value={description}
                                    onChange={onChange}
                                ></input>
                            </div>
                            <div className="form-group">
                                <label htmlFor="price">Price</label>
                                <input
                                    type="text"
                                    name="price"
                                    value={price}
                                    onChange={onChange}
                                ></input>
                            </div>
                            <div class="file-field input-field">
                                <div class="btn">
                                    <span>Thumbnail</span>
                                    <input type="file" onChange={(e) => { handleChange(e.target.files) }} />
                                </div>
                                <div class="file-path-wrapper">
                                    <input class="file-path validate" type="text" />
                                </div>
                            </div>
                            {/* <button class="btn waves-effect waves-light" type="submit" name="action" onClick={handleSave}>Save
    <i class="material-icons right">send</i></button> */}
                            <div className="center">
                                <input
                                    type="submit"
                                    value="Add Course"
                                    className="btn btn-large waves-effect waves-light btn-block "
                                />
                            </div>
                        </form>
                    </div>
                )}
        </div>
    )
}

AddCourse.propTypes = {
    addCourse: PropTypes.func.isRequired,
    loadUser: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    user: state.user.user,
})

export default connect(mapStateToProps, { addCourse, loadUser })(
    AddCourse
)
