import fs from 'fs';
import path from 'path';
const themesDir = path.resolve('.moai/themes/generated');
const themes = fs.readdirSync(themesDir).filter(f => f.endsWith('.json'));
const missingComponents = [
    'avatar',
    'checkbox',
    'progress',
    'slider',
    'modal',
    'dropdown',
    'form',
    'image',
    'radio',
    'textarea',
    'skeleton',
    'scroll-area',
    'select',
    'label',
    'separator',
    'alert-dialog',
    'popover',
    'hover-card',
    'tooltip',
    'sheet',
    'toast',
    'sidebar',
    'navigation-menu',
    'breadcrumb',
    'command',
    'calendar',
];
themes.forEach(themeFile => {
    const filePath = path.join(themesDir, themeFile);
    const theme = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const desc = theme.id;
    const recipes = theme.tokens?.recipes || theme.recipes || {};
    let radius = 'rounded-md';
    let shadow = 'shadow-md';
    let border = 'border border-neutral-200';
    let isBold = false;
    let isPebble = false;
    if (desc.includes('square') ||
        desc.includes('bold') ||
        desc.includes('classic') ||
        desc.includes('editorial')) {
        radius = 'rounded-none';
    }
    if (desc.includes('bold-line') || desc.includes('dark-boldness')) {
        isBold = true;
        border = 'border-2 border-black';
        shadow = 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]';
        if (desc.includes('dark')) {
            border = 'border-2 border-white';
            shadow = 'shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]';
        }
    }
    if (desc.includes('pebble')) {
        isPebble = true;
        radius = 'rounded-2xl';
        shadow = 'shadow-[0_8px_30px_rgb(0,0,0,0.04)]';
        border = 'border-none';
    }
    const containerBase = `bg-white ${border} ${radius} ${shadow}`;
    const darkContainerBase = `bg-neutral-950 ${border} ${radius} ${shadow}`;
    const baseToUse = desc.includes('dark') ? darkContainerBase : containerBase;
    const additionalRecipes = {
        avatar: {
            default: `relative flex h-10 w-10 shrink-0 overflow-hidden ${isPebble ? 'rounded-full' : radius}`,
        },
        checkbox: {
            default: `peer h-4 w-4 shrink-0 ${isPebble ? 'rounded-md' : radius} ${border} ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground`,
        },
        progress: {
            default: `relative h-4 w-full overflow-hidden ${isPebble ? 'rounded-full' : radius} bg-secondary`,
            indicator: `h-full w-full flex-1 bg-primary transition-all`,
        },
        slider: {
            default: `relative flex w-full touch-none select-none items-center`,
            track: `relative h-2 w-full grow overflow-hidden ${isPebble ? 'rounded-full' : radius} bg-secondary`,
            range: `absolute h-full bg-primary`,
            thumb: `block h-5 w-5 ${isPebble ? 'rounded-full' : radius} ${border} bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50`,
        },
        modal: {
            overlay: `fixed inset-0 z-50 bg-black/80 backdrop-blur-sm`,
            content: `fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 ${baseToUse} p-6`,
        },
        dropdown: {
            content: `z-50 min-w-[8rem] overflow-hidden ${baseToUse} p-1`,
            item: `relative flex cursor-default select-none items-center ${isPebble ? 'rounded-sm' : radius} px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50`,
        },
        form: {
            item: `space-y-2`,
            label: `text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${isBold ? 'uppercase tracking-widest font-bold' : ''}`,
            message: `text-[0.8rem] font-medium text-destructive`,
        },
        image: { default: `overflow-hidden ${isPebble ? 'rounded-2xl' : radius}` },
        radio: {
            default: `aspect-square h-4 w-4 rounded-full ${border} text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`,
        },
        textarea: {
            default: `flex min-h-[80px] w-full ${isPebble ? 'rounded-xl' : radius} ${border} bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`,
        },
        skeleton: { default: `animate-pulse ${isPebble ? 'rounded-xl' : radius} bg-muted` },
        'scroll-area': {
            default: `relative overflow-hidden`,
            scrollbar: `flex h-full w-2.5 border-l border-l-transparent p-[1px]`,
        },
        select: {
            trigger: `flex h-10 w-full items-center justify-between ${isPebble ? 'rounded-full' : radius} ${border} bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`,
            content: `relative z-50 min-w-[8rem] overflow-hidden ${baseToUse}`,
        },
        label: {
            default: `text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${isBold ? 'uppercase tracking-wider font-bold' : ''}`,
        },
        separator: {
            default: `shrink-0 bg-border`,
            horizontal: `h-[1px] w-full`,
            vertical: `h-full w-[1px]`,
        },
        'alert-dialog': {
            content: `fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 ${baseToUse} p-6`,
        },
        popover: { content: `z-50 w-72 ${baseToUse} p-4 outline-none` },
        'hover-card': { content: `z-50 w-64 ${baseToUse} p-4 outline-none` },
        tooltip: {
            content: `z-50 overflow-hidden ${isPebble ? 'rounded-full' : radius} bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95`,
        },
        sheet: {
            content: `fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500`,
        },
        toast: {
            default: `group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden p-6 pr-8 shadow-lg transition-all ${baseToUse}`,
        },
        sidebar: { default: `flex h-full w-64 flex-col overflow-y-auto bg-background ${border} pb-4` },
        'navigation-menu': {
            list: `group flex flex-1 list-none items-center justify-center space-x-1`,
            trigger: `group inline-flex h-10 w-max items-center justify-center ${isPebble ? 'rounded-full' : radius} bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50`,
        },
        breadcrumb: {
            list: `flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5`,
            item: `inline-flex items-center gap-1.5`,
            link: `transition-colors hover:text-foreground`,
        },
        command: {
            default: `flex h-full w-full flex-col overflow-hidden ${baseToUse}`,
            input: `flex h-11 w-full rounded-none bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50`,
        },
        calendar: {
            default: `p-3 ${baseToUse}`,
            cell: `h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20`,
            day: `h-9 w-9 p-0 font-normal aria-selected:opacity-100 ${isPebble ? 'rounded-full' : radius}`,
        },
    };
    for (const component of missingComponents) {
        if (!recipes[component]) {
            recipes[component] = additionalRecipes[component];
        }
    }
    if (!theme.tokens) {
        theme.tokens = {};
    }
    theme.tokens.recipes = recipes;
    if (theme.recipes) {
        delete theme.recipes;
    }
    fs.writeFileSync(filePath, JSON.stringify(theme, null, 4));
    console.log(`Updated ${themeFile}`);
});
//# sourceMappingURL=expand-recipes.js.map