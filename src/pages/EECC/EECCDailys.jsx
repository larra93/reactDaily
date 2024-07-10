import React, { useEffect, useState }  from 'react';
import DailysTable from '../../Components/Containers/EECC/EECCDailysTable';
import { Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../helpers/config';
import { toast } from 'react-toastify';

const ContractsPage = () => {
    const [dailys, setDailys] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        fetchDailys(page + 1, rowsPerPage);
    }, [page, rowsPerPage]);
    

    const fetchDailys = async (page, rowsPerPage) => {
        try {
            const response = await axios.get(`${BASE_URL}/Dailys?page=${page}&per_page=${rowsPerPage}`);
            setDailys(response.data.data);
            setTotalCount(response.data.total);
        } catch (error) {
            console.error('Error al obtener los Dailys:', error);
        }
    };


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Box
         sx={{ width: '95%', margin: '0 auto', mt: 4}}>
        <div>
            <h2>Ingresar Daily Report</h2>
            <Box display="flex" justifyContent="flex-end" mb={2}>

            </Box>
            <DailysTable 
                dailys={dailys}
                page={page}
                rowsPerPage={rowsPerPage}
                totalCount={totalCount}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}            />
        </div>
        </Box>
    );
};

export default ContractsPage;
