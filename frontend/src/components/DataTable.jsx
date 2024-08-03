const DataTable = ({ data }) => {
    if (!data || data.length === 0) {
        return <p>No data available</p>;
    }

    const columns = Object.keys(data[0]);

    return (
        <div className="table-container">
            <table className="data-table">
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column}>{column}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {columns.map((column) => (
                                <td key={`${rowIndex}-${column}`}>
                                    {formatCellValue(row[column])}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const formatCellValue = (value) => {
    if (value === null || value === undefined) {
        return '-';
    }
    if (value instanceof Date) {
        return value.toLocaleDateString();
    }
    if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
    }
    return String(value);
};

export default DataTable