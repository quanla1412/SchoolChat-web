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
            <FullCalendar
                viewClassNames="calendar-body"
                plugins={[ dayGridPlugin, timeGridPlugin ]}
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
            />
        </div>
    }
}

export default AppCalendar;