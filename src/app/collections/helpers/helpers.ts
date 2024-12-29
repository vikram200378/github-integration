// import { ColDef } from 'ag-grid-community';

// export function flattenData(data: any): any {
//   const flatten = (obj: any, prefix: string = ''): any =>
//     Object.keys(obj).reduce((acc, key) => {
//       const prop = obj[key];
//       const newKey = prefix ? `${prefix}_${key}` : key;
//       if (typeof prop === 'object' && prop !== null) {
//         return { ...acc, ...flatten(prop, newKey) };
//       } else {
//         return { ...acc, [newKey]: prop ?? 'NA' };
//       }
//     }, {});

//   return flatten(data);
// }

// export function generateDynamicColumns(firstRow: any): any[] {
//   const flattenItem = flattenData(firstRow);

//   const columns = Object.keys(flattenItem).map((key: string) => {
//     if (key === 'html_url') {
//       return {
//         headerName: formatHeaderName(key),
//         field: key,
//         cellRenderer: (params: any) => {
//           return `<a href="${params.value}" target="_blank" rel="noopener noreferrer">${params.value}</a>`;
//         },
//         filter: true,
//         sortable: true,
//         flex: 1,
//       } as ColDef;
//     }

//     return {
//       headerName: formatHeaderName(key),
//       field: key,
//       filter: true,
//       sortable: true,
//       flex: 1,
//     };
//   });

//   return columns;
// }

// // Format header names into human-readable format
// export function formatHeaderName(key: string): string {
//   return key
//     .split('.')
//     .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
//     .join(' ');
// }



import { ColDef } from 'ag-grid-community';

export function flattenData(data: any): any {
  const flatten = (obj: any, prefix: string = ''): any =>
    Object.keys(obj).reduce((acc, key) => {
      const prop = obj[key];
      const newKey = prefix ? `${prefix}_${key}` : key;
      if (typeof prop === 'object' && prop !== null) {
        return { ...acc, ...flatten(prop, newKey) };
      } else {
        return { ...acc, [newKey]: prop ?? 'NA' };
      }
    }, {});

  return flatten(data);
}

export function generateDynamicColumns(firstRow: any): any[] {
  const flattenItem = flattenData(firstRow);

  const columns = Object.keys(flattenItem).map((key: string) => {
    // Check if the value is a URL (http or https)
    if (key === 'html_url' || isUrl(flattenItem[key])) {
      return {
        headerName: formatHeaderName(key),
        field: key,
        cellRenderer: (params: any) => {
          // Render URL as a clickable link
          return `<a href="${params.value}" target="_blank" rel="noopener noreferrer">${params.value}</a>`;
        },
        filter: true,
        sortable: true,
        flex: 1,
        minWidth:200
      } as ColDef;
    }

    return {
      headerName: formatHeaderName(key),
      field: key,
      filter: true,
      sortable: true,
      flex: 1,
      minWidth:200
    };
  });

  return columns;
}

// Function to check if the value is a valid URL (http or https)
function isUrl(value: string): boolean {
  const urlPattern = /^(https?:\/\/[^\s]+)/i;
  return urlPattern.test(value);
}

// Format header names into human-readable format
export function formatHeaderName(key: string): string {
  return key
    .split('.')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
