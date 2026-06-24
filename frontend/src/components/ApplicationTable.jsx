import "../styles/applicationTable.css";
function ApplicationTable({ applications, onStatusChange, onDelete }) {

    return (
        <table border="1" cellPadding="10">

            <thead>
                <tr>
                    <th>Company</th>
                    <th>Role</th>
                    <th>Applied Date</th>
                     <th>Notes</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>

            

            

            <tbody>

                {applications.map((app) => (

                    <tr key={app.id}>

                        <td>{app.company_name}</td>

                        <td>{app.role}</td>

                        <td>{new Date(app.applied_date).toLocaleDateString()}</td>

                        <td>{app.notes}</td>

                        <td>
                            <select
                                value={app.status}
                                onChange={(e) =>
                                    onStatusChange(
                                        app.id,
                                        e.target.value
                                    )
                                }
                            >
                                <option value="Applied">Applied</option>
                                <option value="OA">OA</option>
                                <option value="Interview">Interview</option>
                                <option value="Offer">Offer</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </td>

                        <td>
                            <button
                                onClick={() => onDelete(app.id)}
                                className="delete-btn"
                            >
                                Delete
                            </button>
                        </td>

                    </tr>

                ))}

            </tbody>

        </table>
    );
}

export default ApplicationTable;