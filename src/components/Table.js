import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";

function Table() {
    const navigate = useNavigate();
    const [sections, setSections] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState("");

    useEffect(() => {
        const initialSections = [
            {
                id: 1, name: "Srs Submission", estimate: 0, actual: 0, variance: 0, subsets: [
                    { id: 1, name: "Requirment Collection", estimate: 0, actual: 0, variance: 0 },
                    { id: 2, name: "Technical Evaluation", estimate: 0, actual: 0, variance: 0 },
                    { id: 3, name: "Documentation", estimate: 0, actual: 0, variance: 0 },
                ]
            },
            { id: 2, name: "Project Submission", estimate: 0, actual: 0, variance: 0, subsets: [] },
            { id: 3, name: "Testing", estimate: 0, actual: 0, variance: 0, subsets: [] },
        ];

        if (!localStorage.getItem("sections")) {
            localStorage.setItem("sections", JSON.stringify(initialSections));
        }

        setSections(JSON.parse(localStorage.getItem("sections")));
    }, []);

    const removeSection = (id) => {
        const updatedSections = sections.filter(section => section.id !== id);
        setSections(updatedSections);
        localStorage.setItem("sections", JSON.stringify(updatedSections));
    };

    const addSection = () => {
        const newId = sections.length > 0 ? sections[sections.length - 1].id + 1 : 1;
        const newSection = { id: newId, name: `New Section ${newId}`, estimate: 0, actual: 0, variance: 0, subsets: [] };

        const updatedSections = [...sections, newSection];
        setSections(updatedSections);
        localStorage.setItem("sections", JSON.stringify(updatedSections));
    };

    const handleEditClick = (id, name) => {
        setEditId(id);
        setEditName(name);
    };

    const handleEditChange = (e) => {
        setEditName(e.target.value);
    };

    const handleEditSave = (id) => {
        const updatedSections = sections.map(section =>
            section.id === id ? { ...section, name: editName } : section
        );

        setSections(updatedSections);
        localStorage.setItem("sections", JSON.stringify(updatedSections));
        setEditId(null);
    };

    const totalEstimate = sections.reduce((sum, section) => sum + section.subsets.reduce((s, item) => s + (item.estimate || 0), 0), 0);
    const totalActual = sections.reduce((sum, section) => sum + section.subsets.reduce((s, item) => s + (item.actual || 0), 0), 0);
    const totalVariance = totalEstimate - totalActual;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-600 to-slate-900 text-white flex flex-col p-5">
            <div className="w-full overflow-auto">
                <table className="w-full text-white bg-gray-800 border border-gray-700">
                    <thead>
                        <tr className="border-b border-gray-700">
                            <th className="border-r border-gray-700 p-3">ID</th>
                            <th className="border-r border-gray-700">Name</th>
                            <th className="border-r border-gray-700">Estimate</th>
                            <th className="border-r border-gray-700">Actual</th>
                            <th className="border-r border-gray-700">Variance</th>
                            <th className="border-r border-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sections.map((section) => {
                            const sectionEstimate = section.subsets.reduce((sum, item) => sum + (Number(item.estimate) || 0), 0);
                            const sectionActual = section.subsets.reduce((sum, item) => sum + (Number(item.actual) || 0), 0);
                            const sectionVariance = sectionEstimate - sectionActual;

                            return (
                                <tr
                                    key={section.id}
                                    className="hover:bg-gradient-to-br from-purple-900 to-gray-900 text-center cursor-pointer border-b border-gray-700"
                                >
                                    <td className="p-3 border-r border-gray-700" onClick={() => navigate(`/details/${section.id}`)}>
                                        {section.id}
                                    </td>
                                    <td className="border-r border-gray-700">
                                        {editId === section.id ? (
                                            <input
                                                type="text"
                                                className="bg-gray-900 p-2 rounded-xl w-full text-white text-center"
                                                value={editName}
                                                onChange={handleEditChange}
                                                autoFocus
                                            />
                                        ) : (
                                            <span className="w-full" onClick={() => navigate(`/details/${section.id}`)}>
                                                {section.name}
                                            </span>
                                        )}
                                    </td>
                                    <td className="border-r border-gray-700" onClick={() => navigate(`/details/${section.id} `)}>
                                        {sectionEstimate}
                                    </td>
                                    <td className="border-r border-gray-700" onClick={() => navigate(`/details/${section.id}`)}>
                                        {sectionActual}
                                    </td>
                                    
                                    <td className={`${sectionVariance < 0 ? "text-red-500" : "text-green-500"} border-r border-gray-700`} onClick={() => navigate(`/details/${section.id}`)}>
                                        {sectionVariance}
                                    </td>
                                    <td className="flex justify-center mx-2 m-2">
                                        {editId === section.id ? (
                                            <button
                                                className="border border-gray-700 hover:border-white w-full text-white px-2 py-1 rounded mr-2"
                                                onClick={() => handleEditSave(section.id)}
                                            >
                                                Done
                                            </button>
                                        ) : (
                                            <button
                                                className="border border-gray-700 hover:border-white w-full text-white px-2 py-1 rounded mr-2"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditClick(section.id, section.name);
                                                }}
                                            >
                                                Edit
                                            </button>
                                        )}
                                        <button
                                            className="border border-gray-700 hover:border-white text-white w-full px-2 py-1 rounded"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeSection(section.id);
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        <tr className="text-center font-semibold">
                            <td className="border-r border-gray-700 p-3">Total</td>
                            <td className="border-r border-gray-700"></td>
                            <td className="border-r border-gray-700">{totalEstimate}</td>
                            <td className="border-r border-gray-700">{totalActual}</td>
                            <td className={`${totalVariance < 0 ? "text-red-500" : "text-green-500"} border-r border-gray-700`}>{totalVariance}</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <button
                className="border hover:border-green-500 text-white px-4 py-2 rounded mb-3 mt-3 max-w-[200px]"
                onClick={addSection}
            >
                + Add Section
            </button>
        </div>
    );
}

export default Table;
