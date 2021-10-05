import React from 'react';

import Alert from '@material-ui/lab/Alert';

class Message extends React.Component<any, any> {

    render() {
        return (
            <div style={{
                width: '100%'
            }}>
                { this.props.show && <Alert severity="info">{this.props.message}</Alert> }
            </div>
        );
    }
}

export default Message;