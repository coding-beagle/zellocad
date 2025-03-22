import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "antd";
import { useState, useEffect } from "react";
import { faSun, faMoon } from "@fortawesome/fontawesome-free-solid";

const darkModeTheme = {
  primary: "#1b2845",
  secondary: "#65afff",
  text: "#ffeedb",
  accent: "#a53860",
  secondaryAccent: "#61c9a8",
};
// palette https://coolors.co/1b2845-65afff-ffeedb-a53860-61c9a8

const lightModeTheme = {
  primary: "#ffeedb",
  text: "#1b2845",
  secondary: "#65afff",
  accent: "#a53860",
  secondaryAccent: "#61c9a8",
};

// function ThemeToggler(externalSetTheme) {
//   const [currentTheme, setCurrentTheme] = useState(darkModeTheme);

//   externalSetTheme = setCurrentTheme;

//   const toggleTheme = () => {
//     setCurrentTheme((prevTheme) =>
//       prevTheme === lightModeTheme ? darkModeTheme : lightModeTheme
//     );
//   };

//   useEffect(() => {
//     document.body.style.backgroundColor = currentTheme.primary;
//   }, []);

//   return (
//     <Button
//       onClick={toggleTheme}
//       style={{
//         color: currentTheme.text,
//         backgroundColor: currentTheme.primary,
//       }}
//       type="primary"
//     >
//       <FontAwesomeIcon
//         icon={currentTheme === lightModeTheme ? faSun : faMoon}
//       />
//     </Button>
//   );
// }

// export default ThemeToggler;
export { darkModeTheme, lightModeTheme };
