# SPEC-MCP-012 Acceptance

## Scenario 1: FramingUI-native project

Given a project that imports `@framingui/ui/styles`
When `validate-environment` runs
Then it reports `styles.styleContract = framingui-native`
And it returns no style mismatch issues

## Scenario 2: Utility-first host project

Given a project with a global stylesheet but no FramingUI variable contract
When `validate-environment` runs
Then it reports `styles.styleContract = host-utility`
And it warns that FramingUI component defaults may render incorrectly

## Scenario 3: Mixed variable contract

Given a project that defines only some required FramingUI variables
When `validate-environment` runs
Then it reports `styles.styleContract = mixed`
And it lists the missing variables in `styles.issues`

## Scenario 4: Workflow guidance

Given an agent following `screen-workflow`
When it prepares a screen generation run
Then it checks style contract compatibility before relying on FramingUI component defaults
And it treats migration as an explicit user decision
