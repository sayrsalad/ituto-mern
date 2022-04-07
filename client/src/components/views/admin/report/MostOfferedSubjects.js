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

import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { topSubject } from '../../../../actions/reportActions';

import Loader from '../../../layout/main/Loader';


import { getData } from '../../../../actions/all_actions';

import { CSVLink } from "react-csv";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
ChartJS.register(
    ...registerables
);
const MostOfferedSubject = () => {

    const dispatch = useDispatch();



    useEffect(() => {
        dispatch(getData());
        dispatch(topSubject());
    }, [dispatch]);

    const { topsubjects } = useSelector(state => state.topSubjects);
    const { loading } = useSelector(state => state.datas);

    let offeredSubject = topsubjects.map(s => s.count);
    let offeredSubjectName = topsubjects.map(s => s.subject[0].name);
    offeredSubjectName = offeredSubjectName.map(s => s.split(' '));
    // let tutorname = tutor.map(t => t.userID.firstname + " " + t.userID.lastname);
    //REPORT CHARTSS DOWNLOADS
    const csvDownloadDate = moment(new Date()).format('DD-MMM-YYYY');

    const columns = [
        { label: "Subject Name", key: "name", },
        { label: "Offered By", key: "counts", },

    ]

    const topsubjectData = [];

    topsubjects.forEach(t => {
        topsubjectData.push({
            name: t.subject[0].name,
            counts: t.count
        })
    })



    const csvReport = {

        filename: `${csvDownloadDate}`,
        headers: columns,
        data: topsubjectData


    };


    const downloadPdf = () => {

        const doc = new jsPDF()
        doc.text("Most Offered by Tutors", 20, 10)
        doc.autoTable({
            // columnStyles: {
            //     0: { cellWidth: 20 },
            //     1: { cellWidth: 30 },
            //     2: { cellWidth: 30 },
            //     3: { cellWidth: 20 },
            //     4: { cellWidth: 20 },
            //     5: { cellWidth: 20 },   
            //     6: { cellWidth: 20 },
            //     7: { cellWidth: 20 },
            //     // etc
            // },   
            margin: { top: 25 },
            columns: columns.map(col => ({ ...col, dataKey: columns.key })),
            theme: "striped",
            body: topsubjectData
        })
        doc.save(`${csvDownloadDate}-mostOfferedbyTutors.pdf`)
    }














    const pdfBar = () => {

        const DateGathered = moment(new Date()).format('DD-MMM-YYYY');

        const canvas = document.getElementById('bar-populations');

        const canvasImage = canvas.toDataURL('image/png', 1.0);


        var pdf = new jsPDF('landscape')


        pdf.setFont("helvetica", "bold")
        pdf.setFontSize(40)
        pdf.text(15, 20, 'Most Offered Subject By Tutors')
        pdf.setFont("helvetica", "normal")
        pdf.setFontSize(16)

        // pdf.text(16, 35, `Male: ${male && male}`)
        // pdf.text(80, 35, `Female: ${female && female}`)
        // pdf.text(150, 35, `Total Users: ${users && users.length}`)

        pdf.setFontSize(16)
        pdf.setFont("helvetica", "bolditalic")
        pdf.text(175, 200, `Data gathered as of ${DateGathered}`)


        pdf.addImage(canvasImage, 10, 25, 280, 170);
        pdf.save(`Tutors-MostOfferedSubject-Chart-${DateGathered}.pdf`);
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
                                <h1 className="h1 mb-2 text-gray-800">Most Offered Subject By Tutors</h1>

                                <div className="row align-start">
                                    <div className="col-md-8 col-12">
                                        <p className="mb-4">Presented below are the Most Offered Subject by Tutors</p>
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
                                                            labels: offeredSubjectName,
                                                            datasets: [
                                                                {
                                                                    label: 'Top Offered Subject',
                                                                    data: offeredSubject,


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
                                                        height={800}
                                                        width={600}
                                                        options={{
                                                            plugins: {
                                                                legend: {
                                                                    display: false
                                                                },
                                                            },
                                                            labels: {
                                                                // This more specific font property overrides the global property
                                                                font: {
                                                                    size: 14
                                                                }
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

export default MostOfferedSubject
