export default function Docs({title, open}) {
    return (
        <div className="right-sidebar-documents">
            <div className="right-sidebar-documents-inner">
              <div className="documents-individual">
                <div className="documents-inner" onClick = {open}>
                  <div className="document-title">{title}</div>
                  <div className="document id">
                  </div>
                </div>
              </div>
            </div>
          </div>
    )
}