"use client";

import React, { useState } from 'react';
import './page.css';
import Swal from 'sweetalert2';


const FormSection = () => {

    const [available, setAvailable] = useState(false);
    const [endpoint, setEndpoint] = useState('');
    const [url, setUrl] = useState('');
    const [checkLoading, setCheckLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);


    function submitForm() {
        if (!available || !endpoint || !url) {
            Swal.fire('Oops!', 'Please fill all the fields', 'question');
            return;
        }
        setSubmitLoading(true)
        fetch('/api/add-url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ endpoint:endpoint, redirectUrl: url }),
        }).then(response => response.json())
            .then(data => {
                setSubmitLoading(false)
                if (data.success) {
                    Swal.fire('Great!', `
                    URL added successfully. Deployed Url: <a href="https://clipurl.vercel.app/${endpoint}" target="_blank">https://clipurl.vercel.app/${endpoint}</a>
                    `, 'success');
                } else {
                    Swal.fire('Oops!', 'Error adding Url', 'error');
                }
            })
            .catch((error) => {
                setSubmitLoading(false)
                console.error('Error:', error);
                alert('Error adding URL');
            });
    }

    function checkEndpointAvailability() {
        setEndpoint(endpoint.trim().toLowerCase());
        if (!endpoint) {
            Swal.fire('Oops!', 'Please enter an endpoint', 'question');
            return;
        }

        setCheckLoading(true)

        fetch('/api/check-endpoint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ endpoint }),
        }).then(response => response.json())
            .then(data => {
                setCheckLoading(false)
                if (data.available) {
                    setAvailable(true);
                    setTimeout(() => {
                        document.getElementsByName('url')[0].focus();
                    }, 200);
                    Swal.fire('Great!', 'Endpoint is available', 'success');

                } else {
                    Swal.fire('Oops!', 'Endpoint is taken by someone else. Please try another one.', 'error')
                    setAvailable(false);
                }
            })
            .catch((error) => {
                setCheckLoading(false)
                console.error('Error:', error);
                setAvailable(false);
            });
    }

    return (
        <>
            <div className="login-root" style={{marginTop:'70px'}}>
                <div className="box-root flex-flex flex-direction--column" style={{ minHeight: "100vh", flexGrow: 1 }}>
                    <div className="loginbackground box-background--white padding-top--64">
                        <div className="loginbackground-gridContainer">
                            <div className="box-root flex-flex" style={{ gridArea: "top / start / 8 / end" }}>
                                <div
                                    className="box-root"
                                    style={{
                                        backgroundImage: "linear-gradient(white 0%, rgb(247, 250, 252) 33%)",
                                        flexGrow: 1
                                    }}
                                ></div>
                            </div>
                            <div className="box-root flex-flex" style={{ gridArea: "4 / 2 / auto / 5" }}>
                                <div className="box-root box-divider--light-all-2 animationLeftRight tans3s" style={{ flexGrow: 1 }}></div>
                            </div>
                            <div className="box-root flex-flex" style={{ gridArea: "6 / start / auto / 2" }}>
                                <div className="box-root box-background--blue800" style={{ flexGrow: 1 }}></div>
                            </div>
                            <div className="box-root flex-flex" style={{ gridArea: "7 / start / auto / 4" }}>
                                <div className="box-root box-background--blue animationLeftRight" style={{ flexGrow: 1 }}></div>
                            </div>
                            <div className="box-root flex-flex" style={{ gridArea: "8 / 4 / auto / 6" }}>
                                <div className="box-root box-background--gray100 animationLeftRight tans3s" style={{ flexGrow: 1 }}></div>
                            </div>
                            <div className="box-root flex-flex" style={{ gridArea: "2 / 15 / auto / end" }}>
                                <div className="box-root box-background--cyan200 animationRightLeft tans4s" style={{ flexGrow: 1 }}></div>
                            </div>
                            <div className="box-root flex-flex" style={{ gridArea: "3 / 14 / auto / end" }}>
                                <div className="box-root box-background--blue animationRightLeft" style={{ flexGrow: 1 }}></div>
                            </div>
                            <div className="box-root flex-flex" style={{ gridArea: "4 / 17 / auto / 20" }}>
                                <div className="box-root box-background--gray100 animationRightLeft tans4s" style={{ flexGrow: 1 }}></div>
                            </div>
                            <div className="box-root flex-flex" style={{ gridArea: "5 / 14 / auto / 17" }}>
                                <div className="box-root box-divider--light-all-2 animationRightLeft tans3s" style={{ flexGrow: 1 }}></div>
                            </div>
                        </div>
                    </div>
                    <div className="box-root padding-top--24 flex-flex flex-direction--column" style={{ flexGrow: 1, zIndex: 9 }}>
                        <div className="box-root padding-top--48 padding-bottom--24 flex-flex flex-justifyContent--center">
                            <h1>
                                <a href="/" rel="dofollow">
                                    Clip URL
                                </a>
                            </h1>
                        </div>
                        <div className="formbg-outer">
                            <div className="formbg">
                                <div className="formbg-inner padding-horizontal--48">
                                    <span className="padding-bottom--15 textSpan">Shrink Your URL to ur custom endpoint</span>
                                    <div id="stripe-login">
                                        <div className="field padding-bottom--24">
                                            <label htmlFor="email">Endpoint</label>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                gap: '20px'
                                            }}>
                                                <label style={{fontSize: '16px'}}>
                                                    https://clipurl.vercel.app/
                                                </label>
                                                <input type="text" name="endpoint" style={{fontSize:'18px'}} onChange={
                                                    (e) => {
                                                        setAvailable(false)
                                                        setEndpoint(e.target.value)
                                                    }
                                                }/>
                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'end',
                                                alignItems: 'center',
                                                marginTop: '20px'
                                            }}>
                                                <label style={{paddingRight: '10px'}}>Check the availability of the
                                                    endpoint</label>

                                                <button className={"buttonn"} style={{cursor: 'pointer'}}
                                                        onClick={checkEndpointAvailability} disabled={checkLoading}>
                                                    {checkLoading ? <span
                                                        className="spinner"></span> : "Check"}
                                                </button>

                                            </div>

                                        </div>
                                        <div className="field padding-bottom--24">
                                            <div className="grid--50-50">
                                                <label htmlFor="password">Url</label>

                                            </div>
                                            <input type="text" name="url"
                                                   disabled={!available}
                                                   onChange={
                                                (e) => {
                                                    setUrl(e.target.value)
                                                }
                                            }/>
                                            <label style={{marginTop:'20px'}}>After publishing the link, it will be like </label>
                                            <label>https://clipurl.vercel.app/{endpoint}</label>
                                        </div>

                                        <div className="field padding-bottom--24">
                                            <button onClick={submitForm} disabled={!available || submitLoading}
                                                    className={"submitBtn"}
                                            >
                                                {submitLoading ? <span
                                                    className="spinnerSubmit"></span> : "Publish"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FormSection;
