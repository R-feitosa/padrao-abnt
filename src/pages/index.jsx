import Layout from "./Layout.jsx";

import Home from "./Home";

import Editor from "./Editor";

import MyDocuments from "./MyDocuments";

import Profile from "./Profile";

import SharedDocument from "./SharedDocument";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    Editor: Editor,
    
    MyDocuments: MyDocuments,
    
    Profile: Profile,
    
    SharedDocument: SharedDocument,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Editor" element={<Editor />} />
                
                <Route path="/MyDocuments" element={<MyDocuments />} />
                
                <Route path="/Profile" element={<Profile />} />
                
                <Route path="/SharedDocument" element={<SharedDocument />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}