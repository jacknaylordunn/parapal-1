
# ParaPal - Paramedic Clinical Decision Support

ParaPal is a progressive web application (PWA) designed to support HCPC-registered paramedics and ambulance crews operating within NHS and private ambulance trusts in England, UK. It provides tools for managing patient encounters, recording clinical data, accessing guidelines, performing clinical calculations, and streamlining documentation.

## ⚠️ IMPORTANT: Development Version

**This application is a prototype and NOT intended for clinical use.** All clinical information is placeholder content and has not undergone validation by healthcare professionals.

## Features

- **Offline-First Design**: Critical functions work without internet connectivity
- **Patient Encounter Management**: Record patient demographics and track incidents
- **Vital Signs Recording**: Track and trend vital signs with automated NEWS2 calculation
- **Patient History Documentation**: Record medical history, medications, and allergies
- **Clinical Guidance**: Access to JRCALC guidelines and drug formulary (placeholder content)
- **Clinical Calculators**: Tools for paediatric doses, GCS, and other calculations
- **ATMIST Handover**: Generate structured handover reports

## Technical Stack

- React + TypeScript
- Vite for building
- IndexedDB (via Dexie.js) for offline data storage
- PWA with service workers for offline capability
- Tailwind CSS for styling
- Recharts for vital sign trends visualization

## Local Development

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or pnpm package manager

### Setting Up

1. Clone the repository:

```bash
git clone <repository-url>
cd parapal
```

2. Install dependencies:

```bash
npm install
# or
pnpm install
```

3. Start the development server:

```bash
npm run dev
# or
pnpm dev
```

## Testing

Run the unit tests with:

```bash
npm test
# or
pnpm test
```

## Building for Production

```bash
npm run build
# or
pnpm build
```

The build output will be in the `dist` folder, ready for deployment.

## Placeholder Features

The following features are partially implemented or marked as placeholders:

- **Authentication**: Basic authentication UI is in place but not connected to a backend
- **Data Synchronization**: Local storage works, but cloud sync is a placeholder
- **Clinical Content**: Guidelines and drug information are placeholder content
- **PDF Generation**: UI elements exist but functionality is not implemented
- **Location Services**: Geolocation services are placeholder functionality
- **Export/Upload**: Functionality to export/upload records is a placeholder
- **Pre-alert Messaging**: UI elements exist but functionality is not implemented
- **Body Map Feature**: UI placeholder only

## License

This project is provided for demonstration purposes only.

## Acknowledgements

- NHS Digital for UI design inspiration
- JRCALC guidelines (referenced for structure, content is placeholder)
- UK Resuscitation Council (referenced for algorithm structure)

---

Created with Lovable AI
