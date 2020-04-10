import listSelect from "../../styles/listSelect.module.css";
import React from 'react';


class Dropdown extends React.Component {

constructor(){
 super();
 this.state = {
       displayMenu: false,
 };

  this.showDropdownMenu = this.showDropdownMenu.bind(this);
  this.hideDropdownMenu = this.hideDropdownMenu.bind(this);

};

showDropdownMenu(event) {
    event.preventDefault();
    this.setState({ displayMenu: true }, () => {
    document.addEventListener('click', this.hideDropdownMenu);
    });
}

  hideDropdownMenu() {
    this.setState({ displayMenu: false }, () => {
      document.removeEventListener('click', this.hideDropdownMenu);
    });
}

  render() {
    return (
        <div  className={listSelect.dropdown} style = {{background:"red",width:"200px"}} >
         <div className={listSelect.button} onClick={this.showDropdownMenu}> My Setting </div>

          { this.state.displayMenu ? (
          <ul className={listSelect.list}>
         <li className={listSelect.listItem}><a className="active" href="#Create Page">Create Page</a></li>
         <li className={listSelect.listItem}><a href="#Manage Pages">Manage Pages</a></li>
         <li className={listSelect.listItem}><a href="#Create Ads">Create Ads</a></li>
         <li className={listSelect.listItem}><a href="#Manage Ads">Manage Ads</a></li>
         <li className={listSelect.listItem}><a href="#Activity Logs">Activity Logs</a></li>
         <li className={listSelect.listItem}><a href="#Setting">Setting</a></li>
         <li className={listSelect.listItem}><a href="#Log Out">Log Out</a></li>
          </ul>
        ):
        (
          null
        )
        }

       </div>

    );
  }
}

export default Dropdown;
