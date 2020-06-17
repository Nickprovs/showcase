export const styles = (width, height) => {
  return {
    option: (styles, state) => {
      return {
        ...styles,
        backgroundColor: state.isSelected ? "var(--s6)" : state.isFocused ? "var(--b2)" : "var(--b1)",
        cursor: "pointer",
      };
    },
    control: (styles, state) => {
      return {
        ...styles,
        backgroundColor: "var(--b2)",
        height: height ? height : styles.height,
        width: width ? width : styles.width,
        borderWidth: 2,
        boxShadow: "none",
      };
    },
    menu: (styles, state) => {
      return {
        ...styles,
        backgroundColor: "var(--b1)",
        marginTop: 0,
        width: width ? width : styles.width,
      };
    },
    menuList: (styles, state) => {
      return {
        ...styles,
        paddingTop: 0,
      };
    },
    singleValue: (styles, state) => {
      return {
        ...styles,
        paddingTop: 0,
        color: "var(--f1)",
      };
    },
  };
};

export const theme = (theme) => ({
  ...theme,
  borderRadius: 0,
  colors: {
    ...theme.colors,
    neutral20: "var(--s9)",
    primary25: "var(--s5)",
    primary: "var(--s5)",
  },
});
