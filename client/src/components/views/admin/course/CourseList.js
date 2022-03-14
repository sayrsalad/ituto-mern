import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { useAlert } from 'react-alert';
import { MDBDataTableV5 } from 'mdbreact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getCs, deleteC, clearErrors } from '../../../../actions/courseActions';

import MetaData from '../../../layout/main/MetaData';
import Loader from '../../../layout/main/Loader';

import AdminHeader from '../../../layout/admin/AdminHeader';

const MoviesLists = ({ history }) => {


    const alert = useAlert()
    const dispatch = useDispatch()

    const { loading, error, courses } = useSelector(state => state.courses);
    const { error: deleteError, isDeleted } = useSelector(state => state.course);

    useEffect(() => {
        dispatch(getCs());

        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }

        if (deleteError) {
            alert.error(deleteError);
            dispatch(clearErrors())
        }

        if (isDeleted) {
            alert.success('course deleted successfully');
            history.push('/dashboard/courses');
            dispatch({ type: 'DELETE_COURSE_RESET' });
        }

    }, [dispatch, alert, error, history, deleteError, isDeleted]);

    const setcourses = () => {
        const data = {
            columns: [
                { label: 'Code', field: 'Code', width: 210, sort: 'asc' },
                { label: 'Name', field: 'Name', width: 150, sort: 'asc' },
                { label: 'Degree', field: 'Degree', width: 230, sort: 'asc' },
                { label: 'Actions', field: 'actions', width: 100 }
            ],
            rows: []
        }

        courses.forEach(course => {
            data.rows.push({
                Code: course.code,
                Name: course.name,
                Degree: course.degree,
                actions:
                    <Fragment>
                        <Link to={`/dashboard/course/update/${course._id}`} className="btn btn-primary py-1 px-2 me-3">
                            <FontAwesomeIcon icon="pencil-alt" />
                        </Link>
                        <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => deletecourseHandler(course._id)}>
                            <FontAwesomeIcon icon="trash" />
                        </button>
                    </Fragment>
            })
        })

        return data;
    }

    const deletecourseHandler = (id) => {
        dispatch(deleteC(id));
    }

    return (

        <Fragment>
            <AdminHeader />

            <MetaData title={'All courses'} styles={'html, body, .App { background-color:  !important; } .home-navbar {background: #141414 !important;} footer p {color: #000000 !important;}'} />
            <div className="home-section">
                <Fragment>

                    {loading ? <Loader /> : (
                        <MDBDataTableV5
                            data={setcourses()}
                            striped
                            hover
                            scrollX
                            scrollY
                            maxHeight='100vh'
                            
                        />

                        
                    )}

                    
                </Fragment>
            </div>
        </Fragment>
    )
}

export default MoviesLists