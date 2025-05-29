/**
 * SecureVision Google Apps Script Template
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Apps Script project at script.google.com
 * 2. Replace the default code with this entire file
 * 3. Update the SHEET_ID below with your Google Sheets ID
 * 4. Deploy as a web app with "Execute as: Me" and "Access: Anyone"
 * 5. Copy the web app URL and use it in your SecureVision setup
 */

// ============================================================================
// CONFIGURATION - UPDATE THIS WITH YOUR SHEET ID
// ============================================================================

const SHEET_ID = 'REPLACE_WITH_YOUR_GOOGLE_SHEETS_ID';

// ============================================================================
// MAIN FUNCTIONS - DO NOT MODIFY BELOW THIS LINE
// ============================================================================

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action || 'addIncident';
    
    Logger.log('SecureVision API - Action: ' + action);
    Logger.log('SecureVision API - Data: ' + JSON.stringify(data));
    
    let result;
    switch(action) {
      case 'addIncident':
        result = addIncident(data.data || data);
        break;
      case 'addSite':
        result = addSite(data.data);
        break;
      case 'addOfficer':
        result = addOfficer(data.data);
        break;
      case 'addCategory':
        result = addCategory(data.data);
        break;
      case 'addShift':
        result = addShift(data.data);
        break;
      case 'getData':
        result = getAllData();
        break;
      case 'testConnection':
        result = testConnection();
        break;
      default:
        result = { success: false, error: 'Unknown action: ' + action };
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('SecureVision API Error: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString(),
        message: 'Server error occurred. Check your sheet configuration.'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const action = e.parameter.action || 'getData';
    
    if (action === 'getData') {
      const result = getAllData();
      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (action === 'testConnection') {
      const result = testConnection();
      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: 'Invalid GET action: ' + action 
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('SecureVision GET Error: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================================================
// INCIDENT MANAGEMENT
// ============================================================================

function addIncident(incidentData) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Incidents');
    
    if (!sheet) {
      throw new Error('Incidents sheet not found. Please create a sheet named "Incidents"');
    }
    
    // Generate incident ID
    const lastRow = sheet.getLastRow();
    const incidentId = 'INC' + String(lastRow).padStart(4, '0');
    
    const row = [
      new Date(), // Timestamp
      incidentId,
      incidentData.site || '',
      incidentData.reportingOfficer || '',
      incidentData.incidentDateTime || new Date(),
      incidentData.shift || '',
      incidentData.incidentType || '',
      incidentData.severityLevel || 5,
      incidentData.specificLocation || '',
      incidentData.detailedDescription || '',
      incidentData.clientNotified || 'no',
      incidentData.authoritiesContacted || 'none',
      incidentData.authorityDetails || '',
      incidentData.immediateActionsTaken || '',
      incidentData.gpsCoordinates || '',
      incidentData.witnessesPresent || 'no',
      incidentData.witnessDetails || '',
      incidentData.relatedToPreviousIncident || 'no',
      incidentData.previousIncidentRef || '',
      incidentData.followUpRequired || 'no',
      incidentData.followUpDetails || ''
    ];
    
    sheet.appendRow(row);
    
    return { 
      success: true, 
      message: 'Incident reported successfully',
      incidentId: incidentId,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    Logger.log('Error adding incident: ' + error.toString());
    return { 
      success: false, 
      error: 'Failed to add incident: ' + error.toString(),
      troubleshooting: 'Check that you have an "Incidents" sheet with proper headers'
    };
  }
}

// ============================================================================
// ADMIN DATA MANAGEMENT
// ============================================================================

function addSite(siteData) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Sites');
    
    if (!sheet) {
      throw new Error('Sites sheet not found. Please create a sheet named "Sites"');
    }
    
    const row = [
      new Date(), // Timestamp
      siteData.site_name || '',
      siteData.site_address || '',
      siteData.site_type || '',
      siteData.contact_email || '',
      siteData.supervisor_email || '',
      siteData.risk_level || 'Medium',
      siteData.operating_hours || ''
    ];
    
    sheet.appendRow(row);
    
    return { 
      success: true, 
      message: 'Site added successfully',
      siteName: siteData.site_name
    };
    
  } catch (error) {
    Logger.log('Error adding site: ' + error.toString());
    return { success: false, error: error.toString() };
  }
}

function addOfficer(officerData) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Officers');
    
    if (!sheet) {
      throw new Error('Officers sheet not found. Please create a sheet named "Officers"');
    }
    
    const row = [
      new Date(), // Timestamp
      officerData.first_name || '',
      officerData.last_name || '',
      officerData.email || '',
      officerData.phone || '',
      officerData.badge_number || '',
      officerData.hire_date || '',
      officerData.certifications || ''
    ];
    
    sheet.appendRow(row);
    
    return { 
      success: true, 
      message: 'Officer added successfully',
      officerName: `${officerData.first_name} ${officerData.last_name}`
    };
    
  } catch (error) {
    Logger.log('Error adding officer: ' + error.toString());
    return { success: false, error: error.toString() };
  }
}

function addCategory(categoryData) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Categories');
    
    if (!sheet) {
      throw new Error('Categories sheet not found. Please create a sheet named "Categories"');
    }
    
    const row = [
      new Date(), // Timestamp
      categoryData.category_name || '',
      categoryData.description || '',
      categoryData.default_severity || 5,
      categoryData.requires_notification || 'no',
      categoryData.response_protocol || ''
    ];
    
    sheet.appendRow(row);
    
    return { 
      success: true, 
      message: 'Category added successfully',
      categoryName: categoryData.category_name
    };
    
  } catch (error) {
    Logger.log('Error adding category: ' + error.toString());
    return { success: false, error: error.toString() };
  }
}

function addShift(shiftData) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Shifts');
    
    if (!sheet) {
      throw new Error('Shifts sheet not found. Please create a sheet named "Shifts"');
    }
    
    const row = [
      new Date(), // Timestamp
      shiftData.site_location || '',
      shiftData.shift_name || '',
      shiftData.start_time || '',
      shiftData.end_time || '',
      Array.isArray(shiftData.days_of_week) ? shiftData.days_of_week.join(',') : (shiftData.days_of_week || ''),
      shiftData.assigned_officer || '',
      shiftData.backup_officer || ''
    ];
    
    sheet.appendRow(row);
    
    return { 
      success: true, 
      message: 'Shift added successfully',
      shiftName: shiftData.shift_name
    };
    
  } catch (error) {
    Logger.log('Error adding shift: ' + error.toString());
    return { success: false, error: error.toString() };
  }
}

// ============================================================================
// DATA RETRIEVAL
// ============================================================================

function getAllData() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const result = { success: true, data: {} };
    
    // Get sites data
    try {
      const sitesSheet = spreadsheet.getSheetByName('Sites');
      if (sitesSheet && sitesSheet.getLastRow() > 1) {
        const sitesData = sitesSheet.getDataRange().getValues();
        result.data.sites = sitesData.slice(1).map(row => ({
          name: row[1], // site_name column
          address: row[2],
          type: row[3],
          risk: row[6]
        })).filter(site => site.name); // Filter out empty rows
      } else {
        result.data.sites = [];
      }
    } catch (error) {
      Logger.log('Error getting sites: ' + error.toString());
      result.data.sites = [];
    }
    
    // Get officers data
    try {
      const officersSheet = spreadsheet.getSheetByName('Officers');
      if (officersSheet && officersSheet.getLastRow() > 1) {
        const officersData = officersSheet.getDataRange().getValues();
        result.data.officers = officersData.slice(1).map(row => ({
          name: `${row[1]} ${row[2]}`, // first_name last_name
          email: row[3],
          badge: row[5]
        })).filter(officer => officer.name.trim() !== ' '); // Filter out empty rows
      } else {
        result.data.officers = [];
      }
    } catch (error) {
      Logger.log('Error getting officers: ' + error.toString());
      result.data.officers = [];
    }
    
    // Get categories data
    try {
      const categoriesSheet = spreadsheet.getSheetByName('Categories');
      if (categoriesSheet && categoriesSheet.getLastRow() > 1) {
        const categoriesData = categoriesSheet.getDataRange().getValues();
        result.data.categories = categoriesData.slice(1).map(row => ({
          name: row[1], // category_name
          severity: row[3],
          description: row[2]
        })).filter(category => category.name); // Filter out empty rows
      } else {
        result.data.categories = [];
      }
    } catch (error) {
      Logger.log('Error getting categories: ' + error.toString());
      result.data.categories = [];
    }
    
    // Get shifts data
    try {
      const shiftsSheet = spreadsheet.getSheetByName('Shifts');
      if (shiftsSheet && shiftsSheet.getLastRow() > 1) {
        const shiftsData = shiftsSheet.getDataRange().getValues();
        result.data.shifts = shiftsData.slice(1).map(row => ({
          name: row[2], // shift_name
          site: row[1],
          time: `${row[3]}-${row[4]}`,
          days: row[5]
        })).filter(shift => shift.name); // Filter out empty rows
      } else {
        result.data.shifts = [];
      }
    } catch (error) {
      Logger.log('Error getting shifts: ' + error.toString());
      result.data.shifts = [];
    }
    
    return result;
    
  } catch (error) {
    Logger.log('Error getting all data: ' + error.toString());
    return { 
      success: false, 
      error: error.toString(),
      troubleshooting: 'Check that your SHEET_ID is correct and you have the required sheets'
    };
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function testConnection() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheets = spreadsheet.getSheets().map(sheet => sheet.getName());
    
    const requiredSheets = ['Incidents', 'Sites', 'Officers', 'Categories', 'Shifts'];
    const missingSheets = requiredSheets.filter(name => !sheets.includes(name));
    
    if (missingSheets.length > 0) {
      return {
        success: false,
        error: 'Missing required sheets: ' + missingSheets.join(', '),
        troubleshooting: 'Please create these sheets in your Google Spreadsheet',
        foundSheets: sheets
      };
    }
    
    return {
      success: true,
      message: 'Connection successful! All required sheets found.',
      sheets: sheets,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    Logger.log('Connection test failed: ' + error.toString());
    return {
      success: false,
      error: 'Connection failed: ' + error.toString(),
      troubleshooting: 'Check that your SHEET_ID is correct and you have access to the spreadsheet'
    };
  }
}
