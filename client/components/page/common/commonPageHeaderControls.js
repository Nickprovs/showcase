import { Component } from "react";
import { toast } from "react-toastify";
import pageHeaderStyles from "../../../styles/page/common/pageHeader.module.css";
import BasicButton from "../../common/button/basicButton";
import TransparentButton from "../../common/button/transparentButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Select, { components } from "react-select";
import StringUtilities from "../../../util/stringUtilities";
import Link from "next/link";
import { styles as customReactSelectStyles, theme as customReactSelectTheme } from "../../../misc/customReactSelectStyles";

const RemoveCategoryToast = ({ closeToast, category, onRemoveCategory }) => (
  <div>
    Are you sure you want to remove?
    <BasicButton onClick={() => onRemoveCategory(category)}>Remove</BasicButton>
  </div>
);

// Contract:
// General
// 1.) user - to render user-specific controls
// 2.) mainPagePath - for rendering links - "blog", "software", "photo", or "media"
// 3.) mainContentType - for rendering links - "article", "photo", "media"
// Search
// 1.) searchText
// 2.) onSearchTextChanged
// 3.) onSearch
// Category
// 1.) categories
// 2.) currentCategory
// 3.) onCategoryChange
// 4.) onDeleteCategoryAsync
class CommonPageHeaderControls extends Component {
  constructor(props) {
    super(props);

    this.getCustomCategoryDropdownEntries = this.getCustomCategoryDropdownEntries.bind(this);
  }

  componentWillUnmount() {
    if (this.searchTimer) clearTimeout(this.searchTimer);
  }

  internalOnSearchKeyPressed(e) {
    const { onSearch } = this.props;
    if (e.key != "Enter") return;

    // Unfocuses search box if desired
    // e.target.blur();

    onSearch();
  }

  internalOnSearchTextChanged(text) {
    const { onSearchTextChanged, onSearch } = this.props;

    //Let parent control know the search text changed
    onSearchTextChanged(text);

    //When the user's done typing, tell the parent control to perform the search
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(onSearch, 700);
  }

  getCustomCategoryDropdownEntries(props) {
    const { user, mainPagePath, onDeleteCategoryAsync } = this.props;

    return (
      <components.Option {...props}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {props.data.label}
          {user && user.isAdmin && props.data.label.toLowerCase() !== "all" && (
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              {/* Edit */}
              <Link href={`/${mainPagePath}/edit/category/[id]`} as={`/${mainPagePath}/edit/category/${props.data.value._id}`}>
                <TransparentButton aria-label="Edit Category" style={{ marginLeft: "auto", marginRight: "0", color: "var(--f1)" }}>
                  <FontAwesomeIcon size="2x" icon={faEdit} />
                </TransparentButton>
              </Link>

              {/* Delete */}
              <TransparentButton
                aria-label="Delete Category"
                onClick={() =>
                  toast.info(<RemoveCategoryToast category={props.data.value} onRemoveCategory={async () => await onDeleteCategoryAsync(props.data.value)} />)
                }
                style={{ marginLeft: "auto", marginRight: "0", color: "var(--f1)" }}
              >
                <FontAwesomeIcon size="2x" icon={faTrash} />
              </TransparentButton>
            </div>
          )}
        </div>
      </components.Option>
    );
  }

  render() {
    const { user, mainContentType, mainPagePath } = this.props;
    const { searchText } = this.props;
    const { categories, currentCategory, onCategoryChange } = this.props;

    const categoriesFormattedForSelect = categories ? categories.map((c) => ({ value: c, label: c.name })) : null;
    const currentCategoryFormattedForSelect = categoriesFormattedForSelect.filter((c) => c.value._id === currentCategory._id)[0];

    return (
      <div className={pageHeaderStyles.headerControlsContainer}>
        {/* Search Box */}
        <div className={pageHeaderStyles.headerControl}>
          <input
            aria-label="Search"
            style={{ width: "100%", height: "45px" }}
            className="form-control"
            onKeyPress={(e) => this.internalOnSearchKeyPressed(e)}
            value={searchText}
            onChange={(e) => this.internalOnSearchTextChanged(e.target.value)}
            placeholder="Search..."
          />
        </div>

        {/* Category Box */}
        <div className={pageHeaderStyles.headerControl}>
          <Select
            aria-label="Select Category"
            instanceId={`category_select_${mainPagePath}`}
            options={categoriesFormattedForSelect}
            onChange={(selected) => onCategoryChange(selected.value)}
            value={currentCategoryFormattedForSelect}
            placeholder="Category"
            isSearchable={false}
            components={{ Option: this.getCustomCategoryDropdownEntries }}
            theme={customReactSelectTheme}
            styles={customReactSelectStyles("100%", 45)}
          />
        </div>

        {/* Post Content (ADMIN) */}
        {user && user.isAdmin && (
          <div className={pageHeaderStyles.headerControl}>
            <Link href={`/${mainPagePath}/post/${mainContentType}`}>
              <BasicButton style={{ width: "100%" }}>{`New ${StringUtilities.capitalizeFirstLetterIfPossible(mainContentType)}`}</BasicButton>
            </Link>
          </div>
        )}

        {/* Post Category (ADMIN) */}
        {user && user.isAdmin && (
          <div className={pageHeaderStyles.headerControl}>
            <Link href={`/${mainPagePath}/post/category`}>
              <BasicButton style={{ width: "100%" }}>New Category</BasicButton>
            </Link>
          </div>
        )}
      </div>
    );
  }
}

export default CommonPageHeaderControls;
