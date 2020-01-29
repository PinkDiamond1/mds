import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Menu, Dropdown, Button, Icon, Divider } from "antd";
import MediaQuery from "react-responsive";
import PropTypes from "prop-types";
import * as route from "@/constants/routes";
import * as ENV from "@/constants/environment";
import { signOutFromSiteMinder } from "@/utils/authenticationHelpers";
import { isAuthenticated, getUserInfo } from "@/selectors/authenticationSelectors";
import { MENU } from "@/constants/assets";

/**
 * @class HeaderDropdown.js contains various authentication states, and available links for authenticated users,
 * MediaQueries are used to switch the menu to a hamburger menu when viewed on mobile.
 */

const propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  userInfo: PropTypes.objectOf(PropTypes.string),
};

const defaultProps = {
  userInfo: {},
};

export class HeaderDropdown extends Component {
  handleLogout = () => {
    signOutFromSiteMinder();
  };

  render() {
    const linkMines = (
      <Link to={route.MINES.route} className="header-link">
        My Mines
      </Link>
    );

    const linkUsers = (
      <Link to={route.USERS.route} className="header-link">
        My Users
      </Link>
    );

    const menuItemLogout = (
      <Menu.Item key="logout">
        <Button className="header-dropdown-item-button" onClick={this.handleLogout}>
          Log out
        </Button>
      </Menu.Item>
    );

    const dropdownMenuMobile = (
      <Menu className="header-dropdown-menu">
        <Menu.Item key="mines">
          <Button className="header-dropdown-item-button">{linkMines}</Button>
        </Menu.Item>
        <Menu.Item key="users">
          <Button className="header-dropdown-item-button">{linkUsers}</Button>
        </Menu.Item>
        <Divider className="bg-color-table-seperator" style={{ margin: 0 }} />
        {menuItemLogout}
      </Menu>
    );

    const dropdownMenuDesktop = <Menu className="header-dropdown-menu">{menuItemLogout}</Menu>;

    if (!this.props.isAuthenticated) {
      return (
        <Button className="login-btn">
          <a
            href={`${ENV.KEYCLOAK.loginURL}${ENV.BCEID_LOGIN_REDIRECT_URI}&kc_idp_hint=${ENV.KEYCLOAK.idpHint}`}
          >
            Log in
          </a>
        </Button>
      );
    }

    const smallestDesktopWidth = 1280;
    return (
      <span>
        <MediaQuery minWidth={smallestDesktopWidth}>
          <span>
            {linkMines}
            {linkUsers}
          </span>
          <Dropdown overlay={dropdownMenuDesktop}>
            <Button className="header-dropdown-button">
              {this.props.userInfo.email}
              <Icon type="caret-down" />
            </Button>
          </Dropdown>
        </MediaQuery>
        <MediaQuery maxWidth={smallestDesktopWidth - 1}>
          <Dropdown overlay={dropdownMenuMobile} placement="bottomRight">
            <Button id="dropdown-menu-mobile-trigger" className="header-dropdown-button">
              <img src={MENU} alt="Menu" />
            </Button>
          </Dropdown>
        </MediaQuery>
      </span>
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: getUserInfo(state),
  isAuthenticated: isAuthenticated(state),
});

HeaderDropdown.propTypes = propTypes;
HeaderDropdown.defaultProps = defaultProps;

export default connect(mapStateToProps)(HeaderDropdown);