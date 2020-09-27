import React, { useState, useEffect } from 'react'
import { Player } from 'video-react';
import { connect } from 'react-redux'
import '../../App.css';

const VideoPlayer = ({ video, myCourses, current, user }) => {

    const [mine, setMine] = useState(false);

    useEffect(() => {
        if (myCourses) {
            myCourses.map(course => {
                if (course._id === current._id) {
                    setMine(true)
                }
            })
        }

    }, [mine])

    const { Title, Vurl } = video

    const [clicked, setClicked] = useState(false);

    const onVideoClick = () => {
        setClicked(!clicked);
    }

    return (
        <div>
            <h4>
                <a href="#!" class="collection-item" onClick={onVideoClick}><span class="badge"></span><span class="vid-title">{Title}</span></a>
                <div style={{ "height": "auto", "width": "300px", "marginLeft": "500px", "margin": "50px " }}>
                    {((clicked && mine) || clicked && user.role === 'admin') && <Player>
                        <source src={Vurl} />
                    </Player>}
                </div>
            </h4>
        </div>
    )
}

const mapStateToProps = (state) => ({
    myCourses: state.course.myCourses,
    current: state.course.currentCourse,
    user: state.user.user
})

export default connect(mapStateToProps, null)(VideoPlayer)
