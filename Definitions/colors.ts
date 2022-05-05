export type Color = string;

export class ColorConfig {
    extra : Color;
    parent : Color;
    children : Color;
}

export function SelectMarkerColor() : ColorConfig {
    return { parent: '#00FF00FF', children: '#00FF00AA', extra: '#00FF0077' }
}

export function MarkerColor(marker : number) : ColorConfig {
    switch (marker) {
        case 0:
            return { parent: '#DCDCAAFF', children: '#DCDCAAAA', extra: '#DCDCAA77' };
        case 1:
            return { parent: '#9BDCFFFF', children: '#9BDCFFAA', extra: '#9BDCFF77' };
        case 2:
            return { parent: '#CD9278FF', children: '#CD9278AA', extra: '#CD927877' };
        case 3:
            return { parent: '#B4CDAAFF', children: '#B4CDAAAA', extra: '#B4CDAA77' };
        case 4:
            return { parent: '#FFC8C8FF', children: '#FFC8C8AA', extra: '#FFC8C877' };
        default:
            return { parent: '#BDBDBDFF', children: '#BDBDBDAA', extra: '#BDBDBD77' };
    }
};