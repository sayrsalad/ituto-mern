import React, { useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Chart as ChartJS,
    registerables
} from "chart.js";
import { Bar } from 'react-chartjs-2'
import '../dashboard.scss'

import AdminHeader from '../../../layout/admin/AdminHeader';
import MetaData from '../../../layout/main/MetaData';

import { topratedTutor } from '../../../../actions/reportActions';

import Loader from '../../../layout/main/Loader';


import { getData } from '../../../../actions/all_actions';
import { CSVLink } from "react-csv";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';





// defaults.tooltips.enabled = false
// defaults.legend.position = 'bottom'


ChartJS.register(
    ...registerables
);


// function pdfDownload ({


// });

const TopTutor = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getData());
        dispatch(topratedTutor());
    }, [dispatch]);

    const { tutor } = useSelector(state => state.topTutors);

    const { loading } = useSelector(state => state.datas);

    let ratings = tutor.map(t => t.ratings);
    let names = tutor.map(t => [t.userID.firstname, t.userID.lastname]);

    //REPORT CHARTSS DOWNLOADS

    const columns = [
        { label: "Name", key: "name", },
        { label: "Ratings", key: "ratings", },

    ]

    const columnsPDF = [
        { title: "Firstname", field: "name", },
        { title: "Ratings", field: "ratings", },

    ]

    const tutorData = [];

    tutor.forEach(t => {
        tutorData.push({
            name: t.userID.firstname + " " + t.userID.lastname,
            ratings: t.ratings
        })
    })

    const csvDownloadDate = moment(new Date()).format('DD-MMM-YYYY');

    const csvReport = {

        filename: `${csvDownloadDate}-topratedTutor`,
        headers: columns,
        data: tutorData


    };


    const pdfBar = () => {

        const DateGathered = moment(new Date()).format('DD-MMM-YYYY');

        const canvas = document.getElementById('bar-populations');

        const canvasImage = canvas.toDataURL('image/png', 1.0);


        var pdf = new jsPDF('landscape')


        pdf.setFont("helvetica", "bold")
        pdf.setFontSize(40)
        pdf.text(15, 20, 'Top 10 Rated Tutors')
        pdf.setFont("helvetica", "normal")
        pdf.setFontSize(16)

        pdf.setFontSize(16)
        pdf.setFont("helvetica", "bolditalic")
        pdf.text(175, 200, `Data gathered as of ${DateGathered}`)


        pdf.addImage(canvasImage, 10, 25, 280, 170);
        pdf.save(`Top-Tutors-${DateGathered}.pdf`);
    }


    const downloadPdf = () => {

        const DateGathered = moment(new Date()).format('DD-MMM-YYYY');
        const doc = new jsPDF('landscape')

        doc.setFontSize(50)
        doc.text("Top Rated Tutors", 20, 20)

        doc.setFontSize(14)

        doc.text(200, 200, `Data gathered as of ${DateGathered}`)


        doc.autoTable({
            // columnStyles: {
            //     0: { cellWidth: 100 },
            //     1: { cellWidth: 30 },
             
            //     // etc
            // },   
            margin: { top: 35 },
            columns: columnsPDF.map(col => ({ ...col, dataKey: col.field })),
            theme: "striped",
            body: tutorData
        })
        doc.save(`${csvDownloadDate}-TopTutors-Chart.pdf`)
    }


    return (

        <Fragment>
            <AdminHeader />

            <MetaData title={'All courses'} styles={'html, body, .App { background-color:  !important; } .home-navbar {background: #141414 !important;} footer p {color: #000000 !important;}'} />


            <Fragment>
                {loading ? <Loader /> : (
                    <div className="home-section">





                        {/* //Donut Chart */}
                        <div className="container-fluid">

                            <div className="container-fluid" id="subjectContainer">


                                <h1 className="h1 mb-2 text-gray-800">Top Tutor</h1>

                                <div className="row align-start">
                                    <div className="col-md-8 col-12">


                                        <p className="mb-4">Presented below are the Top Rated Tutors</p>

                                    </div>




                                </div>





                                <div className="row pr-4">





                                    {/* LINE CHART */}

                                    <div className="col-xl- mb-3" >

                                        <div className="card shadow mb-4">
                                            {/* <!-- Card Header - Dropdown --> */}
                                            <div className="card-header">
                                                <div className="row align-center">

                                                    <div className="container">
                                                        <div className="card-body">
                                                            <CSVLink {...csvReport} style={{ color: "#4FBD95", textDecoration: "none" }}>
                                                                <div className="btn" role="button" style={{ backgroundColor: "#2A4250" }}>
                                                                    <i className="color-report fas fa-print fa-xs" >
                                                                        <span className="m-0 font-weight-bold" >
                                                                            &nbsp;CSV

                                                                        </span>
                                                                    </i>
                                                                </div>
                                                            </CSVLink>
                                                            &nbsp;


                                                            <div className="btn" role="button" onClick={pdfBar} style={{ backgroundColor: "#9FDACA" }}>
                                                                <i className="color-report fas fa-print fa-xs" >
                                                                    <span className="m-0 font-weight-bold" >
                                                                        &nbsp;Chart PDF

                                                                    </span>
                                                                </i>
                                                            </div>

                                                            &nbsp;
                                                            <div className="btn" role="button" onClick={downloadPdf} style={{ backgroundColor: "#2A4250" }}>
                                                                <i className="color-report fas fa-print fa-xs" >
                                                                    <span className="m-0 font-weight-bold" >
                                                                        &nbsp;PDF

                                                                    </span>
                                                                </i>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pdficon-align col-md-4 col-12">


                                            </div>
                                            {/* <!-- Card Body --> */}


                                            <div className="chart-pie pt-4">
                                                <div className="card-body">


                                                    <Bar id="bar-populations"

                                                        data={{
                                                            labels: names,
                                                            datasets: [
                                                                {
                                                                    label: 'number of Ratings',
                                                                    data: ratings,

                                                                    backgroundColor: [
                                                                        "#fd7f6f", "#7eb0d5", "#b2e061", "#bd7ebe", "#ffb55a", "#ffee65", "#beb9db", "#fdcce5", "#8bd3c7",
                                                                        '#7eb0d5',
                                                                    ],
                                                                    borderColor: [
                                                                        "#fd7f6f", "#7eb0d5", "#b2e061", "#bd7ebe", "#ffb55a", "#ffee65", "#beb9db", "#fdcce5", "#8bd3c7",
                                                                        '#7eb0d5',
                                                                    ],
                                                                    borderWidth: 1,
                                                                },
                                                                // {
                                                                //   label: 'Quantity',
                                                                //   data: [47, 52, 67, 58, 9, 50],
                                                                //   backgroundColor: 'orange',
                                                                //   borderColor: 'red',
                                                                // },
                                                            ],


                                                        }}
                                                        height={600}
                                                        width={600}
                                                        options={{

                                                            plugins: {
                                                                legend: {
                                                                    display: false
                                                                },
                                                            },
                                                            maintainAspectRatio: false,
    
                                                            legend: {
                                                                labels: {
                                                                    fontSize: 25,
                                                                },
                                                            },
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </Fragment>

        </Fragment >
    )
}

export default TopTutor
