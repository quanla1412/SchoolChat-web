import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from '@fullcalendar/timegrid'
import axios from 'axios';
import {toast} from 'react-toastify';

class AppCalendar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            events: []
        }
    }

    componentDidMount() {
        //Fetch events data
        axios.get("http://localhost:5274/Event/GetEvents?isForAppCalendar=true")
            .then(result => this.setState({events: result.data}))
            .catch(ex => {
                toast.error("Đã có lỗi xảy ra");
                console.log(ex)
            })
    }

    render() {
        return <div class="calendar-body">
            <div className="chat-body-header align-items-center" style={{height: 60, marginBottom: 20}}>
                <span role="button" onClick={this.props.handleClose}><i
                    className="ri-arrow-left-s-line fs-24"></i></span>
                <h4 className="ms-2 mt-2">Xem lịch</h4>
            </div>
            <FullCalendar
                viewClassNames="calendar-body"
                plugins={[dayGridPlugin, timeGridPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    "left": "custom1 prev,next today",
                    "center": "title",
                    "right": "dayGridMonth,timeGridWeek,timeGridDay"
                }}
                eventSources={[{
                    id: 1,
                    backgroundColor: '#d9e8ff',
                    borderColor: '#0168fa',
                    events: this.state.events
                }]}
                dateClick={this.handleDateClick}
            />
        </div>
    }
}

export default AppCalendar;