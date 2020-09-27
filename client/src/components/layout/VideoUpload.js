import React, { useState, useEffect } from 'react';
import firebase from './firebase'
import { Player } from 'video-react';
import M from 'materialize-css/dist/js/materialize.min.js';
import { connect } from 'react-redux'
import { saveVideo } from '../../actions/courseActions'
import { loadUser } from '../../actions/userActions'

const VideoUpload = ({ saveVideo, loadUser, current }) => {

    const [files, setFiles] = useState();
    const [url, setUrl] = useState();
    const [title, setTitle] = useState();

    useEffect(() => {
        loadUser()
    }, [])

    const handleChange = (file) => {
        setFiles(file)
    }

    const handleSave = async () => {
        if (!files) {
            return M.toast({ html: "Please insert a video!" });

        }
        let bucketName = 'images';
        let file = files[0];
        let storageRef = firebase.storage().ref(`${bucketName}/${file.name}`);
        let uploadTask = storageRef.put(file);
        await uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, () => {
            let downloadURL = uploadTask.snapshot.downloadURL
        })

        // storageRef = firebase.storage().ref();

        // storageRef.child('images/' + files[0].name).getDownloadURL().then((url) => {
        //     console.log(url);
        //     saveVideo('1', url)
        // })
        storageRef = firebase.storage().ref();
        // let spaceRef = storageRef.child('images/' + files[0].name);
        // storageRef.child('images/' + files[0].name).getDownloadURL().then((url) => {
        //     console.log(url);
        //     saveVideo('1', url)
        // })
        const url = await storageRef.child('images/' + files[0].name).getDownloadURL();
        console.log(url)
        saveVideo(current._id, title, url)

        M.toast({ html: "Video saved successfully" });

    }

    const showImage = async () => {
        if (!files) {
            return M.toast({ html: 'Please upload a video to show!!' })

        }
        let storageRef = firebase.storage().ref();
        // let spaceRef = storageRef.child('images/' + files[0].name);
        // storageRef.child('images/' + files[0].name).getDownloadURL().then((url) => {
        //     console.log(url);
        //     setUrl(url)
        // })
        const url = await storageRef.child('images/' + files[0].name).getDownloadURL();
        console.log(url)
        setUrl(url)

        if (!url) {
            return M.toast({ html: 'Please upload a video to show!!' })
        }
    }

    return (
        <div className="container" style={{ marginBottom: '1000px' }}>
            {/* <input type="file" onChange={(e) => { handleChange(e.target.files) }} /> */}
            <h1 style={{ marginTop: '100px' }}>
                <span class="grey-text">Upload</span>
                <span className="teal-text"> Lecture</span>
                <br /><br />
            </h1>
            <div className="input-field">
                <div className="material-icons prefix teal-text">title</div>
                <input required type="text" name='title' value={title} id="title" onChange={e => setTitle(e.target.value)} />
                <label className="white-text" for="title">Title</label>
            </div>
            <div class="file-field input-field">
                <div class="btn">
                    <span>Video</span>
                    <input type="file" onChange={(e) => { handleChange(e.target.files) }} />
                </div>
                <div class="file-path-wrapper">
                    <input class="file-path validate" type="text" />
                </div>
            </div>
            <button class="btn waves-effect waves-light" type="submit" name="action" onClick={handleSave}>Save
    <i class="material-icons right">send</i>
            </button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <button class="btn waves-effect waves-light" type="submit" name="action" onClick={showImage}>Show the video I uploaded
    <i class="material-icons right">movie</i>
            </button>
            <div style={{ "height": "auto", "width": "300px", "marginLeft": "500px" }}>
                {url && <Player>
                    <source src={url} />
                </Player>}
            </div>
        </div>
    );
}

const mapStateToProps = (state) => ({
    current: state.course.currentCourse
})

export default connect(mapStateToProps, { saveVideo, loadUser })(VideoUpload)