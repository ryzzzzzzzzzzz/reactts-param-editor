import React, {ChangeEvent, FC, FormEvent, useEffect, useState} from 'react';
import './App.css'
import {AiFillDelete} from 'react-icons/ai';
import {Simulate} from "react-dom/test-utils";
import focus = Simulate.focus;

// ================================ Структура ================================

const params = [
    {
        id: 1,
        name: "Назначение"
    },
    {
        id: 2,
        name: "Длина"
    }
]

const model = {
    "paramValues": [
        {
            paramId: 1,
            value: "повседневное"
        },
        {
            paramId: 2,
            value: "макси"
        }
    ]
}

// ================================ Структура ================================

// ============================ Интерфейсы и типы ============================

interface Param {
    id: number,
    name: string,
    type: string
}

interface ParamValue {
    paramId: number,
    value: string
}

interface ParamWithValue extends Param {
    value: ParamValue["value"]
}

interface Model {
    paramValues: ParamValue[],
    // colors: Color[]
}

interface Props {
    params: Param[],
    model: Model
}

interface AddParamFormProps {
    addParam: (newParam: ParamWithValue) => void
}

interface DisplayParamsProps {
    paramsList: ParamWithValue[]
    updateParam: (newParam: ParamWithValue) => void
    deleteParam: (id: number) => void
}

interface SingleParamProps {
    param: ParamWithValue
    updateParam: (newParam: ParamWithValue) => void
    deleteParam: (id: number) => void
}

interface EditParamFormProps {
    data: ParamWithValue
    updateParam: (newParam: ParamWithValue) => void
    handleToggleEdit: () => void
}

// ============================ Интерфейсы и типы ============================

// ================================== Форма ==================================

const initState = {
    name: '',
    value: ''
}

const AddParamForm: FC<AddParamFormProps> = ({addParam}) => {
    const [newParam, setNewParam] =
        useState<{name: string, value: string}>(initState);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setNewParam({
            ...newParam,
            [name]: value
        });
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const {name, value, type} = newParam
        if (name && value) {
            addParam({
                id: Date.now(),
                name,
                value,
                type
            })
            setNewParam(initState)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>Параметр</label>
                <input
                    name="name"
                    type="text"
                    onChange={handleChange}
                    value={newParam.name}
                />
            <label>Значение</label>
                <input
                    name="value"
                    type="text"
                    onChange={handleChange}
                    value={newParam.value}
                />
            <button type="submit">Добавить</button>
        </form>
    )
}

// ================================== Форма ==================================

// =========================== Дисплей параметров ============================

const DisplayParams: FC<DisplayParamsProps> = ({paramsList, updateParam, deleteParam}) => {
    return (
        <div className="container">
            {paramsList.map((param, index) => {
                return <SingleParam key={index} param={param} updateParam={updateParam} deleteParam={deleteParam}/>
            })}
        </div>
    )
}

// =========================== Дисплей параметров ============================

// ================================ Параметр =================================

const SingleParam: FC<SingleParamProps> = ({param, updateParam, deleteParam}) => {
    const [editParam, setEditParam] = useState<ParamWithValue>(param);

    const handleEdit = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const {value} = e.target;
        setEditParam({
            ...editParam,
            value: value
        });
    }

    useEffect(() => {
        const {value} = editParam
        if (value) {
            updateParam(editParam)
        }
    }, [editParam]);

    const handleDelete = () => {
        deleteParam(param.id)
    }

    return (
        <div>
            <div>{param.name}</div>
            <div>
                <input id="input"
                   name={param.name}
                   type={param.type}
                   value={editParam.value}
                   onChange={handleEdit}
                />
                </div>

            <div className="param-controls">
                <AiFillDelete onClick={handleDelete}/>
            </div>
        </div>
    )
}

// ================================ Параметр =================================

// =================================== App ===================================

const App: FC = () => {
    const [paramsList, setParamsList] = useState<ParamWithValue[]>([])

    const addParam = (newParam: ParamWithValue) => {
        setParamsList([...paramsList, newParam])
    }

    const updateParam = (newParam: ParamWithValue) => {
        setParamsList(paramsList.map((param) => (
            param.id === newParam.id
                ? newParam
                : param
        )))
    }

    const deleteParam = (id: number) => {
        const newParamList = paramsList.filter((param) => param.id !== id)
        setParamsList(newParamList)
    }

    return (
        <div>
            <button onClick={() => console.log(paramsList)}>Тык</button>
            <AddParamForm
                addParam={addParam}
            />
            <DisplayParams
                paramsList={paramsList}
                updateParam={updateParam}
                deleteParam={deleteParam}
            />
        </div>
    )
}

// =================================== App ===================================

export default App