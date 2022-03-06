import { useEffect, useState } from "react";
import { ColorList } from "../../../Constanta";
// import classes from './CategoryCard.module.css'

function CategoryCard(props) {
    const colorList = ColorList;

    const [bgColor, setBgColor] = useState(null);

    useEffect(() => {
        if (!bgColor) setBgColor(colorList[Math.floor(Math.random() * 10)])
    }, [bgColor, colorList]);

    return (
        <div className={`p-4 rounded-lg transition ease duration-200 bg-${bgColor} hover:bg-opacity-20 cursor-pointer h-48 overflow-hidden flex flex-col justify-between`}>
            <label className="text-2xl text-white font-bold">{props.name}</label>

            <div className="relative">
                <img src={props.image} alt={props.name} className="absolute -bottom-8 -right-8 w-7/12 max-w-32 transform rotate-25" />
            </div>
        </div>
    )
}

export default CategoryCard;