import React, { useState } from "react";
import { Button, Card } from "react-bootstrap";
import blank from '../blank.png';
import { GET_ALL_TAG } from "../Network";
import Checkbox from "./checkBox";
import deleteIcon from "../delete-icon.svg";

const FilterBox = (props) => {

    const [tagData, setTagData] = useState([]);
    const [excludeTagData, setExcludeTagData] = useState([]);
    const [selectedIncludeTagList, setSelectedIncludeTagList] = useState([]);
    const [selectedExcludeTagList, setSelectedExcludeTagList] = useState([]);
    const [minMsgRecieved, setMinMsgRecieved] = useState(null);
    const [minMsgSent, setMinMsgSent] = useState(null);
    const [maxMsgRecieved, setMaxMsgRecievedd] = useState(null);
    const [maxMsgSent, setMaxMsgSent] = useState(null);

    React.useEffect(() => {
        let token = JSON.parse(window.localStorage.getItem('token'))
        // call getAllTag API
        if (token) {
            callTagListAPI(token)
        }
    }, []);

    async function callTagListAPI(token) {
        let result = await GET_ALL_TAG(token);
        if (result) {
            setTagData(result?.tags);
            setExcludeTagData(result?.tags);

        }
    }

    const handleIncludeItemClick = (value) => {
        let tempArr = [...tagData]
        let index = tempArr.findIndex(element => element.name === value);
        let selectedTempArr = [...selectedIncludeTagList]
        let selectedArrIndex = selectedTempArr.findIndex(element => element.name === value);
        if (tempArr[index].isSelected) {
            tempArr[index].isSelected = false
            selectedTempArr.splice(selectedArrIndex, 1);
            setSelectedIncludeTagList(selectedTempArr)
        }
        else {
            tempArr[index].isSelected = true
            setSelectedIncludeTagList(prevState => [...prevState, tempArr[index]])
        }
        setTagData(tempArr)

    }

    const handleExcludeItemClick = (value) => {
        let tempArr = [...excludeTagData]
        let selectedTempArr = [...selectedExcludeTagList] || []
        let index = tempArr.findIndex(element => element.name === value);
        let selectedArrIndex = selectedTempArr.findIndex(element => element.name === value);
        if (tempArr[index].isSelected) {
            tempArr[index].isSelected = false
            selectedTempArr.splice(selectedArrIndex, 1);
            setSelectedExcludeTagList(selectedTempArr)
        }
        else {
            tempArr[index].isSelected = true
            setSelectedExcludeTagList(prevState => [...prevState, tempArr[index]])
        }
        setExcludeTagData(tempArr)

    }
    const handleMouseOver = (value, action, isInclude) => {
        if (isInclude) {
            let tempArr = [...tagData]
            let index = tempArr.findIndex(element => element.name === value);
            tempArr[index].isHover = action
            setTagData(tempArr)
        } else {
            let tempArr = [...excludeTagData]
            let index = tempArr.findIndex(element => element.name === value);
            tempArr[index].isHover = action
            setExcludeTagData(tempArr)
        }
    };
    const handleDelete = (value, isInclude) => {
        if (isInclude) {
            let tempArr = [...tagData]
            let index = tempArr.findIndex(element => element.name === value?.name);
            tempArr.splice(index, 1);
            setTagData(tempArr)
        } else {
            let tempArr = [...excludeTagData]
            let index = tempArr.findIndex(element => element.name === value?.name);
            tempArr.splice(index, 1);
            setExcludeTagData(tempArr)
        }
    }
    const renderIncludeTag = () => {
        let tempArr = []
        if (tagData && tagData.length > 0) {
            tagData.map(element => {
                if (element.name) {
                    tempArr.push(
                        <div
                            className={`filter-list-tag-item ${element.isSelected && "selected"} `}
                            onMouseOver={() => handleMouseOver(element?.name, true, true)}
                            onMouseOut={() => handleMouseOver(element?.name, false, true)}
                        >
                            <div onClick={() => handleIncludeItemClick(element?.name)}
                            >
                                <p >
                                    {element?.name}
                                </p>
                            </div>
                            {element?.isHover &&
                                <div style={{ alignSelf: 'center' }} onClick={() => {
                                    handleDelete(element, true);
                                }}>
                                    <img src={deleteIcon} />
                                </div>
                            }
                            {element.isSelected && <div
                                className="circle-check"> &#10003; </div>
                            }
                        </div>
                    )
                }
            });
        }
        return tempArr;
    }

    const renderExcludeTag = () => {
        let tempArr = []
        if (excludeTagData && excludeTagData.length > 0) {
            excludeTagData.map(element => {
                if (element.name) {
                    tempArr.push(<div
                        className={`filter-list-tag-item ${element.isSelected && "selected"} `}
                        onMouseOver={() => handleMouseOver(element?.name, true, false)}
                        onMouseOut={() => handleMouseOver(element?.name, false, false)}
                    >
                        <div onClick={() => handleExcludeItemClick(element?.name)}>
                            <p >
                                {element?.name}
                            </p>
                        </div>
                        {element?.isHover &&
                            <div style={{ alignSelf: 'center' }} onClick={() => { handleDelete(element, false) }}>
                                <img src={deleteIcon} />
                            </div>
                        }
                        {element.isSelected && <div
                            className="circle-check"> &#10003; </div>
                        }
                    </div>
                    )
                }
            });
        }
        return tempArr;
    }
    const saveFilter = () => {
        let tempTagArr = [];
        let tempNotTagArr = [];
        if (selectedIncludeTagList.length > 0) {
            selectedIncludeTagList.map(element => {
                if (element.name) {
                    tempTagArr.push(element.name)
                }
            })
        }
        if (selectedExcludeTagList.length > 0) {
            selectedExcludeTagList.map(element => {
                if (element.name) {
                    tempNotTagArr.push(element.name)
                }
            })
        }
        let tempObj = {
            tags: tempTagArr,
            notTags: tempNotTagArr,
            maxMessagesRecv: maxMsgRecieved,
            maxMessagesSent: maxMsgSent,
            minMessagesRecv: minMsgRecieved,
            minMessagesSent: minMsgSent
        };

        props.callContactApi(null, null, tempObj)
    }

    return (<Card className="filter-list-main-container">
        <div className="filter-list-text1">
            <strong style={{ fontSize: '32px' }}>Audience</strong>
            <strong style={{ fontSize: '12px', color: "#bdc8d8", alighSelf: "center" }}>{`${props.count} Contacts`}</strong>
        </div>
        <div className="filter-list-tag-text">Include Tags:</div>
        <div className='filter-list-box'>{renderIncludeTag()}</div>
        <div className="filter-list-tag-text">Exclude Tags:</div>
        <div className='filter-list-box'>{renderExcludeTag()}</div>
        <div className="filter-list-tag-text">Message Sent:</div>
        <div className="filter-list-tag-msg">
            <input
                type="text"
                value={minMsgSent}
                className="filter-list-search"
                placeholder="Min"
                onChange={(e) => {
                    const re = /^[0-9\b]+$/;

                    // if value is not blank, then test the regex

                    if (e.target.value === '' || re.test(e.target.value)) {
                        setMinMsgSent(e.target.value)
                    }
                }}
            />
            <input
                type="text"
                value={maxMsgSent}
                className="filter-list-search"
                placeholder="Max"
                onChange={(e) => {
                    const re = /^[0-9\b]+$/;

                    // if value is not blank, then test the regex

                    if (e.target.value === '' || re.test(e.target.value)) {
                        setMaxMsgSent(e.target.value)
                    }
                }}
            />
        </div>
        <div className="filter-list-tag-text">Message Recieved:</div>
        <div className="filter-list-tag-msg">
            <input
                type="text"
                value={minMsgRecieved}
                className="filter-list-search"
                placeholder="Min"
                onChange={(e) => {
                    const re = /^[0-9\b]+$/;

                    // if value is not blank, then test the regex

                    if (e.target.value === '' || re.test(e.target.value)) {
                        setMinMsgRecieved(e.target.value)
                    }
                }}
            />
            <input
                type="text"
                value={maxMsgRecieved}
                className="filter-list-search"
                placeholder="Max"
                onChange={(e) => {
                    const re = /^[0-9\b]+$/;

                    // if value is not blank, then test the regex

                    if (e.target.value === '' || re.test(e.target.value)) {
                        setMaxMsgRecievedd(e.target.value)
                    }
                }}
            />


        </div>
        <div className="filter-list-tag-msg">

            <Button className="filter-list-button"
                onClick={saveFilter}
            > Save Filters</Button>
        </div>
    </Card>)



}
export default FilterBox;