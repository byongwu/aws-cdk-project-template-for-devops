/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3'

import { AppContext } from '../../app-context'
import { AppConfig } from '../../app-config'
import { CommonHelper, ICommonHelper } from '../../common/common-helper'
import { CommonGuardian, ICommonGuardian } from '../../common/common-guardian'


export function Override(target: any, propertyKey: string, descriptor: PropertyDescriptor){}

export interface StackCommonProps extends cdk.StackProps {
    projectPrefix: string;
    appConfig: AppConfig;
    appConfigPath: string;
    variables: any;
}

export class BaseStack extends cdk.Stack implements ICommonHelper, ICommonGuardian {
    protected stackConfig: any;
    protected projectPrefix: string;
    protected commonProps: StackCommonProps;

    private commonHelper: ICommonHelper;
    private commonGuardian: ICommonGuardian;

    constructor(appContext: AppContext, stackConfig: any) {
        super(appContext.cdkApp, stackConfig.Name, appContext.stackCommonProps);

        this.stackConfig = stackConfig;
        this.commonProps = appContext.stackCommonProps;
        this.projectPrefix = appContext.stackCommonProps.projectPrefix;

        this.commonHelper = new CommonHelper({
            construct: this,
            env: this.commonProps.env!,
            stackName: this.stackName,
            projectPrefix: this.projectPrefix,
            variables: this.commonProps.variables
        });

        this.commonGuardian = new CommonGuardian({
            construct: this,
            env: this.commonProps.env!,
            stackName: this.stackName,
            projectPrefix: this.projectPrefix,
            variables: this.commonProps.variables
        });
    }

    findEnumType<T>(enumType: T, target: string): T[keyof T] {
        return this.commonHelper.findEnumType(enumType, target);
    }

    exportOutput(key: string, value: string) {
        this.commonHelper.exportOutput(key, value);
    }

    putParameter(paramKey: string, paramValue: string): string {
        return this.commonHelper.putParameter(paramKey, paramValue);
    }

    getParameter(paramKey: string): string {
        return this.commonHelper.getParameter(paramKey);
    }

    putVariable(variableKey: string, variableValue: string) {
        this.commonHelper.putVariable(variableKey, variableValue);
    }

    getVariable(variableKey: string): string {
        return this.commonHelper.getVariable(variableKey);
    }

    createS3BucketName(baseName: string): string {
        return this.commonGuardian.createS3BucketName(baseName);
    }

    createS3Bucket(baseName: string, encryption?: s3.BucketEncryption, versioned?: boolean): s3.Bucket {
        return this.commonGuardian.createS3Bucket(baseName, encryption, versioned);
    }
}
