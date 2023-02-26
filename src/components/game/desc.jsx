import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLevel } from "../../store/slices/levelSlice";
import { Tooltip } from "bootstrap/dist/js/bootstrap.esm.min.js";
import { replaceKeyWordToTag } from "../../utils/converters";
import desc from "../../json/descriptions.json";

const Description = ({ levelsList }) => {
  const curLvl = useSelector((state) => state.level.value);
  const lang = useSelector((state)=> state.lang.value);
  const dispatch = useDispatch();

  const completedLevels = JSON.parse(localStorage.getItem("completedLevels"));
  const [completedLevel, setCompletedLevels] = useState(
    completedLevels ? completedLevels : ["level-1"]
  );
    
  const descLevels = desc[lang].levels[`level-${curLvl}`];
  const descriptions = desc[lang].descriptions;
 
  
  const handleLevelOption = (e) => {
    dispatch(setLevel(Number(e.target.value)));
  };

  useEffect(() => {
    localStorage.setItem("currentLevel", curLvl);
    if (!completedLevel.includes(`level-${curLvl}`)) {
      setCompletedLevels((prevState) => [...prevState, `level-${curLvl}`]);
    }
  }, [curLvl]);

  useEffect(() => {
    localStorage.setItem("completedLevels", JSON.stringify(completedLevel));
  }, [completedLevel]);

  useEffect(() => {
    Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]')).forEach(
      (tooltipNode) => new Tooltip(tooltipNode)
    );
  });

  return (
    <div className="desc-panel panel">
      <div className="level-selector">
        <select
          onChange={handleLevelOption}
          value={curLvl}
          className="selector"
        >
          {Object.keys(levelsList).map((level) => (
            <option
              value={level}
              key={level}
              disabled={!completedLevel.includes(`level-${level}`)}
            >
              {desc[lang].others.level}-{level}
            </option>
          ))}
        </select>
      </div>
      <div className="desc monitor">
        <p
          className="text-content"
          dangerouslySetInnerHTML={{
            __html: replaceKeyWordToTag(descLevels.text1, descriptions),
          }}
        ></p>
        <ul className="text-content">
          {descLevels.list.map((elem, index) => (
            <li
              key={index}
              dangerouslySetInnerHTML={{
                __html: replaceKeyWordToTag(elem, descriptions),
              }}
            ></li>
          ))}
        </ul>
        <p
          className="text-content"
          dangerouslySetInnerHTML={{
            __html: replaceKeyWordToTag(descLevels.text2, descriptions),
          }}
        ></p>
      </div>
    </div>
  );
};
export default Description;
