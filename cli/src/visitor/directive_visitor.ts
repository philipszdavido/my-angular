import * as ts from "typescript";
import {classHasDecorator, ComponentMetadata, createCmpDefinitionPropertiesNode} from "../transformer/transformer";
import {ctx, i0, ɵdir, ɵɵdefineDirective} from "../constants/constants";

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

export function createHostBinding(node: ts.ClassDeclaration, metadata: ComponentMetadata) {



    if (metadata.host) {

        const properties = (((metadata.host).initializer as ts.ObjectLiteralExpression).properties)

        properties.forEach((property) => {
            if (ts.isPropertyAssignment(property)) {
                const key = property.name.getText();
                const value = property.initializer.getText();
                parseHostBindings(key, value);
            }
        })
    }

    return ts.factory.createFunctionDeclaration(
        [],
        undefined,
        node.name + "_HostBinding",
        undefined,
        [
            ts.factory.createParameterDeclaration(
                undefined,
                undefined,
                "rf"
            ),
            ts.factory.createParameterDeclaration(
                undefined,
                undefined,
                ctx
            ),
        ],
        null,
        ts.factory.createBlock(
            [],
            true
        )
    )
}

function parseHostBindings(key: string, value: string) {

    const firstChar = key[0]
    const lastChar = key[key.length - 1]
    const attrName = key.slice(1, key.length - 1)

    if (firstChar === "(" && lastChar === ")") {
        // listener
    } else if (firstChar === "[" && lastChar === "]") {
        // property binding
        const attrParts = attrName.split(".")

        if (attrParts.length > 1) {
            const attrType = attrParts[0]
        }
    }

}

export function getTokenExpression(typeNode: ts.TypeReferenceNode): ts.Expression {
    const typeName = typeNode.typeName;

    if (ts.isIdentifier(typeName)) {
        return ts.factory.createIdentifier(typeName.text);
    }

    function getTokenExpressionFromQualified(
        name: ts.EntityName
    ): ts.Expression {
        if (ts.isIdentifier(name)) {
            return ts.factory.createIdentifier(name.text);
        }

        if (ts.isQualifiedName(name)) {
            return ts.factory.createPropertyAccessExpression(
                getTokenExpressionFromQualified(name.left),
                name.right.text
            );
        }

        throw new Error("Unsupported qualified name in DI token");
    }

    if (ts.isQualifiedName(typeName)) {
        return ts.factory.createPropertyAccessExpression(
            getTokenExpressionFromQualified(typeName.left),
            typeName.right.text
        );
    }

    throw new Error("Unsupported DI token type");
}

