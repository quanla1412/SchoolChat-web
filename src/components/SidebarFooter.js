import React from 'react';
import {useNavigate} from 'react-router-dom';

const SidebarFooter = ({user, toggleSidebarFooter, showCalendar, showUpdateProfile}) => {
    const navigate = useNavigate();
    const logOut = () => {
        localStorage.removeItem('token');
        navigate("/login");
    }

    return <div className="sidebar-footer">
        <div className="sidebar-footer-top">
            <div className="sidebar-footer-thumb">
                <img src={!!user.avatar ? "http://localhost:5274/images/" + user.avatar : "/assets/img/default-avatar.jpg"} alt="avatar"/>
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
                <span role="button" onClick={showUpdateProfile}><i className="ri-edit-2-line"></i> Cập nhật thông tin</span>
                <a href=""><i className="ri-profile-line"></i> View Profile</a>
            </nav>
            <hr/>
            <nav className="nav">
                <span role="button" onClick={showCalendar}><i className="ri-calendar-view"></i> Xem lịch</span>
                <a href=""><i className="ri-lock-line"></i> Privacy Settings</a>
                <a href=""><i className="ri-user-settings-line"></i> Account Settings</a>
                <span role="button" onClick={logOut}><i className="ri-logout-box-r-line"></i> Đăng xuất</span>
            </nav>
        </div>
    </div>
}
export default SidebarFooter;