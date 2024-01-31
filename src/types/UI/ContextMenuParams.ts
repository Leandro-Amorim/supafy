import { MenuId, ShowContextMenuParams } from "react-contexify";

export interface ContextMenuParams extends Omit<ShowContextMenuParams, 'id'> {
	id?: MenuId
}