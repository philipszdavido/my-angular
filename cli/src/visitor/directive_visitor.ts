import * as ts from "typescript";
import {classHasDecorator, ComponentMetadata, createCmpDefinitionPropertiesNode} from "../transformer/transformer";
import {i0, ɵdir, ɵɵdefineDirective} from "../constants/constants";

export function hasDirectiveDecorator(node: ts.ClassDeclaration) {
    return classHasDecorator(node, "Directive")
}

export function createDefineDirectiveStatic(
    componentName: string,
    metadata: ComponentMetadata,
    node: ts.Node,
    hoisted: ts.Statement[]
) {
    const f = ts.factory;

    return f.createPropertyDeclaration(
        [f.createModifier(ts.SyntaxKind.StaticKeyword)],
        ɵdir,
        undefined,
        undefined,
        f.createCallExpression(
            f.createPropertyAccessExpression(
                f.createIdentifier(i0),
                ɵɵdefineDirective,
            ),
            undefined,
            [
                f.createObjectLiteralExpression(
                    createCmpDefinitionPropertiesNode(componentName, metadata, node, hoisted),
                    true,
                ),
            ],
        ),
    );
}
