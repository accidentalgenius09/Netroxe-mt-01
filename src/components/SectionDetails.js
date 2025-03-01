import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function SectionDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [section, setSection] = useState(null);
    const [subsets, setSubsets] = useState([]);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        const sections = JSON.parse(localStorage.getItem('sections') || '[]');
        const foundSection = sections.find(section => String(section.id) === id);
        if (foundSection) {
            setSection(foundSection);
            setSubsets(foundSection.subsets);
        }
    }, [id]);

    const updateLocalStorage = (updatedSubsets) => {
        const sections = JSON.parse(localStorage.getItem('sections') || "[]");
        const updatedSections = sections.map((section) =>
            section.id === parseInt(id) ? { ...section, subsets: updatedSubsets } : section
        );
        localStorage.setItem('sections', JSON.stringify(updatedSections));
    };

    const handleNameChange = (itemId, value) => {
        const updatedSubsets = subsets.map(item =>
            item.id === itemId ? { ...item, name: value } : item
        );
        setSubsets(updatedSubsets);
    };

    const saveEdit = () => {
        updateLocalStorage(subsets);
        setEditId(null);
    };

    const addItem = () => {
        const newItem = {
            id: subsets.length + 1,
            name: 'Enter Name',
            estimate: 0,
            actual: 0
        };
        const updatedSubsets = [...subsets, newItem];
        setSubsets(updatedSubsets);
        updateLocalStorage(updatedSubsets);
    };

    const removeItem = (itemId) => {
        const updatedSubsets = subsets.filter(item => item.id !== itemId);
        setSubsets(updatedSubsets);
        updateLocalStorage(updatedSubsets);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-600 to-slate-900 text-white flex flex-col items-center">
            <div className="container mx-auto p-4 w-full">
                <h2 className="text-center text-3xl font-bold pb-5">{section?.name || "Section Details"}</h2>

                <div className="w-full overflow-auto">
                    <table className="w-full text-white bg-gray-800 border border-gray-700">
                        <thead>
                            <tr className='border-b border-r border-gray-700'>
                                <th className="p-3 border-r border-gray-700">ID</th>
                                <th className='border-r border-gray-700'>Name</th>
                                <th className='border-r border-gray-700'>Estimate</th>
                                <th className='border-r border-gray-700'>Actual</th>
                                <th className='border-r border-gray-700'>Variance</th>
                                <th className='border-r border-gray-700'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subsets.map((item, index) => (
                                <tr key={index} className="hover:bg-gradient-to-br from-purple-900 to-gray-900 to-slate-900 text-center border-b border-gray-700">
                                    <td className="p-3 border-r border-gray-700">{item.id}</td>
                                    <td className='border-r border-gray-700'>
                                        {editId === item.id ? (
                                            <input
                                                type="text"
                                                className="bg-gray-700 p-2 rounded text-white w-full"
                                                value={item.name}
                                                onChange={(e) => handleNameChange(item.id, e.target.value)}
                                            />
                                        ) : (
                                            <span>
                                                {item.name}
                                            </span>
                                        )}
                                    </td>

                                    <td className="border-r border-gray-700">
                                        {editId === item.id ? (
                                            <input
                                                type="number"
                                                className="bg-gray-700 py-2 px-1 rounded text-white w-full"
                                                value={item.estimate}
                                                onChange={(e) => {
                                                    const updatedSubsets = subsets.map(i =>
                                                        i.id === item.id ? { ...i, estimate: e.target.value } : i
                                                    );
                                                    setSubsets(updatedSubsets);
                                                }}
                                                onBlur={(e) => {
                                                    const updatedSubsets = subsets.map(i =>
                                                        i.id === item.id ? { ...i, estimate: Number(e.target.value) || 0 } : i
                                                    );
                                                    setSubsets(updatedSubsets);
                                                    updateLocalStorage(updatedSubsets);
                                                }}
                                            />
                                        ) : (
                                            <span>{item.estimate}</span>
                                        )}
                                    </td>

                                    <td className="border-r border-gray-700">
                                        {editId === item.id ? (
                                            <input
                                                type="numnber"
                                                className="bg-gray-700 py-2 px-1 rounded text-white w-full"
                                                value={item.actual}
                                                onChange={(e) => {
                                                    const updatedSubsets = subsets.map(i =>
                                                        i.id === item.id ? { ...i, actual: e.target.value } : i
                                                    );
                                                    setSubsets(updatedSubsets);
                                                }}
                                                onBlur={(e) => {
                                                    const updatedSubsets = subsets.map(i =>
                                                        i.id === item.id ? { ...i, actual: Number(e.target.value) || 0 } : i
                                                    );
                                                    setSubsets(updatedSubsets);
                                                    updateLocalStorage(updatedSubsets);
                                                }}
                                            />
                                        ) : (
                                            <span>{item.actual}</span>
                                        )}
                                    </td>

                                    <td className={`border-r border-gray-700 ${Number(item.estimate) - Number(item.actual) < 0 ? "text-red-500" : "text-green-500"}`}>
                                        {item.estimate - item.actual}
                                    </td>

                                    <td className="flex gap-2 justify-center mx-2 m-2">
                                        {editId === item.id ? (
                                            <button onClick={saveEdit} className="border border-gray-700 hover:border-white px-2 w-full py-1 rounded">Done</button>
                                        ) : (
                                            <button onClick={() => setEditId(item.id)} className="border border-gray-700 hover:border-white w-full px-2 py-1 rounded">Edit</button>
                                        )}
                                        <button onClick={() => removeItem(item.id)} className="border border-gray-700 hover:border-white px-2 w-full py-1 rounded">Remove</button>
                                    </td>
                                </tr>
                            ))}
                            {subsets.length !== 0 && (
                                <tr className='text-center'>
                                    <td className='border-r border-gray-700 font-semibold text-md p-3'>Total</td>
                                    <td className='border-r border-gray-700'></td>
                                    <td className='border-r border-gray-700'>
                                        {subsets.reduce((sum, item) => sum + (item.estimate || 0), 0)}
                                    </td>
                                    <td className='border-r border-gray-700'>
                                        {subsets.reduce((sum, item) => sum + (item.actual || 0), 0)}
                                    </td>
                                    <td className={`border-r border-gray-700 ${subsets.reduce((sum, item) => sum + (Number(item.estimate) - Number(item.actual) || 0), 0) < 0 ? "text-red-500" : "text-green-500"}`}>
                                        {subsets.reduce((sum, item) => sum + ((item.estimate || 0) - (item.actual || 0)), 0)
                                        }
                                    </td>
                                </tr>)
                            }
                        </tbody>
                    </table>
                </div>

                <div className="w-full flex justify-center mt-4">
                    <button className="border border-white hover:border-green-500 px-4 py-2 rounded w-40 mx-2" onClick={addItem}>
                        Add Item
                    </button>
                    <button className="border border-white hover:border-blue-500 px-4 py-2 rounded w-40 mx-2" onClick={() => navigate(-1)}>
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SectionDetails;
