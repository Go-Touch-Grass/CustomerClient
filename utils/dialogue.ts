export interface DialogueOption {
    id: string;
    text: string;
    nextNodeId: string | null;
}

export interface DialogueNode {
    id: string;
    response: string | null;
    options: DialogueOption[];
}

export interface DialogueTree {
    initialNodeId: string;
    nodes: Record<string, DialogueNode>;
}