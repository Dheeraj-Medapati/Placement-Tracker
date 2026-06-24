import { useEffect, useState } from "react";
import api from "../services/api";
import ApplicationForm from "../components/ApplicationForm";
import ApplicationTable from "../components/ApplicationTable";
import Navbar from "../components/Navbar";
import "./../styles/dashboard.css"
import StatusChart from "../components/StatusChart";

function Dashboard() {

    const [applications, setApplications] = useState([]);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("All");

    const [stats, setStats] = useState({
        total: 0,
        applied: 0,
        oa: 0,
        interview: 0,
        offer: 0,
        rejected: 0
    });

    const fetchDashboardData = async () => {

        const token = localStorage.getItem("token");

        const statsResponse = await api.get(
            "/stats",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setStats(statsResponse.data);

        const appResponse = await api.get(
            "/applications",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setApplications(appResponse.data);
    };

    const handleAddApplication = async (data) => {

        try {

            const token = localStorage.getItem("token");

            await api.post(
                "/applications",
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const response = await api.get(
                "/applications",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            await fetchDashboardData();


        } catch (error) {

            console.log(error);

        }
    };

    const handleStatusChange = async (
        applicationId,
        newStatus
    ) => {

        try {

            const token =
                localStorage.getItem("token");

            await api.put(
                `/applications/${applicationId}`,
                {
                    status: newStatus
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            const response = await api.get(
                "/applications",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            await fetchDashboardData();


        } catch (error) {

            console.log(error);

        }
    };

    const handleDelete = async (
        applicationId
    ) => {

        try {

            const token =
                localStorage.getItem("token");

            await api.delete(
                `/applications/${applicationId}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            const response =
                await api.get(
                    "/applications",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            await fetchDashboardData();


        } catch (error) {

            console.log(error);

        }
    };

    useEffect(() => {

        fetchDashboardData();

    }, []);

    const filteredApplications = applications.filter((app) => {

        const matchesSearch =
            app.company_name
                .toLowerCase()
                .includes(search.toLowerCase());

        const matchesStatus =
            statusFilter === "All" ||
            app.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <>
            <Navbar />

            <div className="dashboard">

                <h1>Dashboard</h1>

                <ApplicationForm
                    onAdd={handleAddApplication}
                />

                <div className="stats">

                    <div className="card">
                        <h3>Total</h3>
                        <p>{stats.total}</p>
                    </div>

                    <div className="card">
                        <h3>Applied</h3>
                        <p>{stats.applied}</p>
                    </div>

                    <div className="card">
                        <h3>OA</h3>
                        <p>{stats.oa}</p>
                    </div>

                    <div className="card">
                        <h3>Interview</h3>
                        <p>{stats.interview}</p>
                    </div>

                    <div className="card">
                        <h3>Offer</h3>
                        <p>{stats.offer}</p>
                    </div>

                </div>

                <h2>Application Analytics</h2>

                <StatusChart stats={stats} />

                <h2>My Applications</h2>

                <input
                    type="text"
                    placeholder="Search Company..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="filter-select"
                >
                    <option value="All">All Status</option>
                    <option value="Applied">Applied</option>
                    <option value="OA">OA</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                </select>

                <ApplicationTable
                    applications={filteredApplications}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                />

            </div>
        </>
    );
}

export default Dashboard;