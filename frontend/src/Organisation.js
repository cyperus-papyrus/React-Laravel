import React, { useCallback, useState, useEffect, useRef } from "react";
import './Organisation.scss';
import avatar from './avatar_empty.jpg';
import axios from 'axios';


const Modal = ({ isOpen, setIsOpen, man }) => {
    const handleClose = useCallback(() => { setIsOpen(false); }, [setIsOpen]);
    const modalRef = useRef(null);

    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === "Escape" && isOpen) {
                handleClose();
            }
        };
        const handleClickOutside = (event) => {
            if (event.target === modalRef.current) {
                handleClose();
            }
        };

        window.addEventListener("keydown", handleEscapeKey);
        window.addEventListener("click", handleClickOutside);
        return () => {
            window.removeEventListener("keydown", handleEscapeKey);
            window.removeEventListener("click", handleClickOutside);
        };
    }, [isOpen, handleClose]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" ref={modalRef}>
            <div className="modal">
                <div>
                    <img src={avatar} alt={man.name} style={{ width: "100px", height: "100px" }} />
                    <h3>{man.name}</h3>
                    <p>({man.position})</p>
                </div>
                <button onClick={handleClose}>Закрыть</button>
            </div>
        </div>
    );
};
const Employee = ({ employee, level = 0, getSubordinates }) => {
    const [isSubordinatesOpen, setIsSubordinatesOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleCloseModal = useCallback(() => setIsModalOpen(false), []);
    const containerClass = isSubordinatesOpen ? "employee-container open" : "employee-container";
    const subordinates = getSubordinates(employee.id);

    return (
        <div className={containerClass}>
            <div key={employee.id} className={"employee-item level-" + level}>
                <div className="employee-inner" onClick={() => setIsModalOpen(true)}>
                    <div className="employee-posiiton">
                        {employee.position ? (
                            <>
                                <div>{employee.position}</div>
                                <div className="employee-name-second">{employee.name}</div>
                            </>
                        ) : (
                            <div>{employee.name}</div>
                        )}
                    </div>
                </div>
                {subordinates.length > 0 && (
                    <>
                        <button className={"rounded level-" + level} onClick={() => setIsSubordinatesOpen(!isSubordinatesOpen)}>
                            {isSubordinatesOpen ? "×" : "➜"}
                        </button>
                        {isSubordinatesOpen && (
                            <OrganizationSheme
                                employees={subordinates}
                                level={level + 1}
                                isOpen={isSubordinatesOpen}
                                setIsOpen={setIsSubordinatesOpen}
                                getSubordinates={getSubordinates}
                            />
                        )}
                    </>
                )}
            </div>

            <Modal isOpen={isModalOpen} setIsOpen={handleCloseModal} man={employee} />
        </div>
    );
};

const OrganizationSheme = ({ employees, level, isOpen, setIsOpen, getSubordinates }) => {
    return (
        <div className={"subordinates-container level-" + level}>
            {employees &&
                employees.map((employee) => (
                    <Employee
                        employee={employee}
                        level={level}
                        key={employee.id}
                        getSubordinates={getSubordinates}
                    />
                ))}
        </div>
    );
};

const CEOList = ({ ceo }) => {
    return (
        <div className="ceo-container">
            {ceo.map((c) => (
                <Ceo
                    ceo={c}
                    key={c.id} />
            ))}
        </div>
    );
}

const Ceo = ({ ceo }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <div
                className="ceo-item"
                onClick={openModal}
            >
                <span>{ceo.position}</span>
                <span>{ceo.name}</span>
            </div>
            {isModalOpen && (
                <Modal
                    isOpen={true}
                    setIsOpen={closeModal}
                    man={ceo}
                />
            )}
        </>
    );
};

const OrganizationStructure = () => {
    const [ceo, setCeo] = useState([]);
    const [employees, setEmployees] = useState([]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const ceoResponse = await axios.get('http://localhost:8000/api/ceo');
                const employeesResponse = await axios.get('http://localhost:8000/api/employees');

                setCeo(ceoResponse.data);
                setEmployees(employeesResponse.data);
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
            }
        };

        fetchData();
    }, []);


    const groupedEmployees = employees.reduce((acc, employee) => {
        const { chief_id } = employee;
        if (!acc[chief_id]) {
            acc[chief_id] = [];
        }
        acc[chief_id].push(employee);
        return acc;
    }, {});

    const getSubordinates = (id) => {
        return groupedEmployees[id] || [];
    };

    return (
        <div>
            <CEOList ceo={ceo} />
            <OrganizationSheme
                employees={getSubordinates(null)}
                level={0}
                isOpen={false}
                setIsOpen={() => { }}
                getSubordinates={getSubordinates}
            />
        </div>
    );
};

export default OrganizationStructure;