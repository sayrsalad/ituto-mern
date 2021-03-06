import React, { useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MDBDataTableV5 } from 'mdbreact';

import {
    Chart as ChartJS,
    registerables
} from "chart.js";
import { Pie } from 'react-chartjs-2'
import '../dashboard.scss'

import AdminHeader from '../../../layout/admin/AdminHeader';
import MetaData from '../../../layout/main/MetaData';

import Loader from '../../../layout/main/Loader';

import { topratedYearLevel } from '../../../../actions/reportActions';
import { getTuteeCount } from '../../../../actions/reportActions';
import { getData } from '../../../../actions/all_actions';


import { CSVLink } from "react-csv";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';


ChartJS.register(
    ...registerables
);



const MostTuteeYearLevel = () => {
    const { topYearLevel } = useSelector(state => state.topYearLevel);
    const { tuteeCount } = useSelector(state => state.getTuteeCounts);
    const { loading } = useSelector(state => state.datas);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getData());
        dispatch(topratedYearLevel());
        dispatch(getTuteeCount());
    }, [dispatch]);

    const sortArray = ["First", "Second", "Third", "Fourth"];
    const sorted = topYearLevel.sort((a, b) => sortArray.indexOf(a._id) - sortArray.indexOf(b._id));
    let yearLevel = sorted.map(year => year.count)


    const setUsers = () => {

        const data = {

            columns: [
                { label: 'Firstname', field: 'Firstname', width: 210 },
                { label: 'Lastname', field: 'Lastname', width: 150 },
                { label: 'Year Level', field: 'YearLevel', width: 150 },
                { label: 'Email', field: 'Email', width: 150 },
            ],
            rows: []
        }

        tuteeCount.forEach(allUsers => {
            data.rows.push({
                Firstname: allUsers.firstname,
                Lastname: allUsers.lastname,
                Username: allUsers.username,
                Gender: allUsers.gender,
                Email: allUsers.email,
                Role: allUsers.role,
                YearLevel: allUsers.yearLevel,
                Phone: allUsers.phone,
                Time: allUsers.createdAt
            })
        })
        return data;
    }

    //REPORT CHARTSS DOWNLOADS
    // const columns = [
    //     { label: "Year Level", key: "name", },
    //     { label: "Quantity", key: "ratings", },
    // ]

    const columnsPDF = [
        { title: "Year Level", field: "name", },
        { title: "Quantity", field: "ratings", },
    ]

    const tuteeColumns = [
        { label: "Firstname", key: "firstname", },
        { label: "Lastname", key: "lastname", },
    ]

    const tuteePerYearData = [];

    tuteeCount.forEach(t => {
        tuteePerYearData.push({
            firstname: t.firstname,
            lastname: t.lastname
        })
    })

    const yearLevelData = [];

    sorted.forEach(t => {
        yearLevelData.push({
            name: t._id,
            ratings: t.count
        })
    })

    const csvDownloadDate = moment(new Date()).format('DD-MMM-YYYY');

    const csvReport = {
        filename: `${csvDownloadDate}-YearLevel`,
        headers: tuteeColumns,
        data: tuteePerYearData
    };


    //PDF CHART

    const pdfBar = () => {

        const DateGathered = moment(new Date()).format('DD-MMM-YYYY');
        const canvas = document.getElementById('pie-populations');
        const canvasImage = canvas.toDataURL('image/png', 1.0);
        var pdf = new jsPDF('portrait')

        pdf.setFont("helvetica", "bold")
        pdf.setFontSize(30)
        pdf.text(10, 20, 'Tutees per Year Level')
        pdf.setFont("helvetica", "normal")
        pdf.setFontSize(15)

        pdf.text(`First Year: ${topYearLevel[0].count} `, 10, 35, 360, 60)
        pdf.text(`Second Year: ${topYearLevel[1].count} `, 50, 35, 360, 60)
        pdf.text(`Third Year: ${topYearLevel[2].count} `, 105, 35, 360, 60)
        pdf.text(`Fourth Year: ${topYearLevel[3].count} `, 150, 35, 360, 60)

        pdf.setFontSize(16)
        pdf.setFont("helvetica", "bolditalic")
        pdf.text(110, 270, `Data gathered as of ${DateGathered}`)


        pdf.addImage(canvasImage, 35, 55, 150, 150);
        pdf.save(`Tutees-per-YearLevel-${DateGathered}.pdf`);
    }


    //PDF FILE 

    const downloadPdf = () => {

        const DateGathered = moment(new Date()).format('DD-MMM-YYYY');
        const doc = new jsPDF('landscape')

        doc.setFont("helvetica", "bold")
        doc.setFontSize(30)
        doc.text("Tutees per Year Level", 10, 20)
        doc.setFontSize(14)
        doc.text(200, 200, `Data gathered as of ${DateGathered}`)
        doc.autoTable({
            // columnStyles: {
            //     0: { cellWidth: 100 },
            //     1: { cellWidth: 30 },

            //     // etc
            // },   
            margin: { top: 35 },
            theme: "striped",
            columns: columnsPDF.map(col => ({ ...col, dataKey: col.field })),
            body: yearLevelData
        })
        doc.save(`${csvDownloadDate}-TopTutors-Chart.pdf`)
    }

    return (

        <Fragment>
            <AdminHeader />
            <MetaData title={'Reports - Population of Tutees per Year'} styles={'html, body, .App { background-color:  !important; } .home-navbar {background: #141414 !important;} footer p {color: #000000 !important;}'} />
            <Fragment>
                {loading ? <Loader /> : (
                    <div className="home-section">
                        {/* //Donut Chart */}
                        <div className="container-fluid">
                            <div className="container-fluid" id="subjectContainer">
                                <h1 className="h1 mb-2 text-gray-800">Tutee Per Year Level</h1>
                                <div className="row align-start">
                                    <div className="col-md-8 col-12">
                                        <p className="mb-1">Presented below are the population of tutees per year level</p>
                                    </div>
                                    {/* LINE CHART */}
                                    <div className="container-fluid">
                                        <div className="row pr-4 pt-2">
                                            {/* TABLEEEEEEE */}
                                            <div className="col col-lg-8">
                                                <div className="card shadow mb-3">
                                                    {/* <!-- Card Header - Dropdown --> */}
                                                    <div className="card-header py-3">
                                                        <h6 className="color1 m-0 font-weight-bold">
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
                                                        </h6>
                                                    </div>
                                                    {/* <!-- Card Body --> */}

                                                    {/* USER DATA SECTION */}

                                                    <div className="card-body">
                                                        <div className="table-responsive">
                                                            <div id="dataTable_wrapper" className="dataTables_wrapper dt-bootstrap4">
                                                                <Fragment>
                                                                    {loading ? <Loader /> : (
                                                                        <MDBDataTableV5 className="table-height"
                                                                            data={setUsers()}
                                                                            striped
                                                                            hover
                                                                            searchTop
                                                                            searchBottom={false}
                                                                            barReverse
                                                                        />
                                                                    )}
                                                                </Fragment>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* DONUTTTT SECTIONNNNN*/}

                                            <div className="col col-lg-4" >
                                                <div className="card shadow pb-3">
                                                    {/* <!-- Card TITLE*/}
                                                    <div className="card-header">
                                                        <div className="row align-center">
                                                            <div className="container  py-2">
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
                                                    {/* <!-- Card Body --> */}
                                                    <div className="card-body py-4">
                                                        <div className="chart-pie">
                                                            <Pie id="pie-populations"
                                                                data={{
                                                                    labels: ['First year', 'Second Year', 'Third Year', 'Fourth Year'],
                                                                    datasets: [
                                                                        {
                                                                            label: '# of votes',
                                                                            data: yearLevel,

                                                                            backgroundColor: [
                                                                                "#50e991", "#0bb4ff", "#e6d800", "#FD7F6F",
                                                                                // '#4BC0C0',
                                                                                // '#9966FF',
                                                                                // '#FF9F40',
                                                                            ],
                                                                            borderColor: [
                                                                                "#50e991", "#0bb4ff", "#e6d800", "#FD7F6F",
                                                                                // 'rgba(75, 192, 192, 1)',
                                                                                // 'rgba(153, 102, 255, 1)',
                                                                                // 'rgba(255, 159, 64, 1)',
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
                                                                height={525}
                                                                width={500}
                                                                options={{
                                                                    maintainAspectRatio: false,
                                                                    render: 'percentage',
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
                                            </div >
                                        </div>
                                    </div>
                                    {/* DONUTTTT SECTIONNNNN*/}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Fragment>
        </Fragment >
    )
}

export default MostTuteeYearLevel




