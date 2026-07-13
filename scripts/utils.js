// Shared helpers
function formatLayout(layout) {
            if(!layout) return '';
            const parts = layout.split('-');
            if(parts.length !== 4) return layout;
            return parts[0]+'室'+parts[1]+'厅'+parts[2]+'厨'+parts[3]+'卫';
        }
