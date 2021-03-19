import moment from 'moment'
import '../styles/UniversalDashboard.css'

export default function Docs({title, open, timestamp}) {
    return (
        <div className="right-sidebar-documents">
            <div className="right-sidebar-documents-inner">
              <div className="documents-individual">
                <div className="documents-inner" onClick = {open}>
                  <div className="document-title">{title}</div>
                  <div><span className = 'lastEdited'>Last edited:</span> {moment(timestamp).calendar()}</div>
                </div>
              </div>
            </div>
          </div>
    )
}