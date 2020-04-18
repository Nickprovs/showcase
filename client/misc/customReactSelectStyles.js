export const styles = {
  option: (styles, state) => {
    return {
      ...styles,
      backgroundColor: state.isSelected ? "var(--s6)" : state.isFocused ? "var(--s11)" : "var(--b1)",
      cursor: "pointer",
    };
  },
  control: (styles) => {
    return {
      ...styles,
      height: 45,
      borderWidth: 2,
      boxShadow: "none",
    };
  },
  menu: (styles, state) => {
    return {
      ...styles,
      marginTop: 0,
    };
  },
  menuList: (styles, state) => {
    return {
      ...styles,
      paddingTop: 0,
    };
  },
};

export const theme = (theme) => ({
  ...theme,
  borderRadius: 0,
  colors: {
    ...theme.colors,
    neutral20: "var(--s8)",
    primary25: "var(--s5)",
    primary: "var(--s5)",
  },
});
