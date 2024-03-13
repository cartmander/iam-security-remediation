export enum PolicyType {
    AWS_MANAGED = "AWS_MANAGED",
    CUSTOMER_MANAGED = "CUSTOMER_MANAGED",
    INLINE = "INLINE"
}

export enum OverPermissiveRolesCsv {
    AWS_MANAGED_POLICIES_CSV = "awsManagedPolicies.csv",
    WILDCARD_PERMISSIONS_CSV = "wildcardPermissions.csv"
}

export enum OverPermissiveRolesMessage {
    NO_AWS_MANAGED = "No AWS Managed Policies attached",
    NO_CUSTOMER_MANAGED = "No Customer Managed Policies attached",
    NO_INLINE = "No Inline Policies attached",
    NO_ERROR = "No errors found",
    NO_TAG = "No Platform tag found"
}