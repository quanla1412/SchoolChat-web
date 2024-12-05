import React from 'react';

const SidebarFooter = ({user, toggleSidebarFooter, showCalendar}) => {
    return <div className="sidebar-footer">
        <div className="sidebar-footer-top">
            <div className="sidebar-footer-thumb">
                <img src="/assets/img/img7.jpg" alt=""/>
            </div>
            <div className="sidebar-footer-body">
                <h6>{user.name}</h6>
                <p>Premium Member</p>
            </div>
            <span role="button" className="dropdown-link" onClick={toggleSidebarFooter}>
                <i className="ri-arrow-down-s-line"></i>
            </span>
        </div>
        <div className="sidebar-footer-menu">
        <nav className="nav">
                <a href="./Update-profile"><i className="ri-edit-2-line"></i> Cập nhật thông tin</a>
                <a href=""><i className="ri-profile-line"></i> View Profile</a>
            </nav>
            <hr/>
            <nav className="nav">
                <span role="button" onClick={showCalendar}><i className="ri-calendar-view"></i> Xem lịch</span>
                <a href=""><i className="ri-lock-line"></i> Privacy Settings</a>
                <a href=""><i className="ri-user-settings-line"></i> Account Settings</a>
                <a href=""><i className="ri-logout-box-r-line"></i> Log Out</a>
            </nav>
        </div>
    </div>
}
export default SidebarFooter;