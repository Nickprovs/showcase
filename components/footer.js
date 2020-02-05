import footer from "../styles/footer.module.css";

export default function Footer(props) {
  const { externalPages } = props;

  const externalPageListStyle = {
    listStyleType: "none"
  };

  const externalPageListItemStyle = {
    paddingRight: "25px",
    display: "inline"
  };

  const externalPageIconStyle = {
    fontSize: "25px"
  };

  return (
    <div className={footer.footer}>
      <ul style={externalPageListStyle}>
        {externalPages.map(item => (
          <li style={externalPageListItemStyle} key={item.label}>
            <a href={item.href}>
              <i style={externalPageIconStyle} className={item.iconClasses}></i>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
